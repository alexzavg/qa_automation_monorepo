#!/bin/bash

set -e  # Exit on any error
set -x  # Print commands for debugging

# Set up log file
LOG_FILE="$ANDROID_HOME/emulator_startup.log"

echo "=== Starting Android Emulator ===" | tee "$LOG_FILE"
echo "Timestamp: $(date)" | tee -a "$LOG_FILE"

trap 'handle_error $? $LINENO' ERR

function handle_error() {
    local exit_code=$1
    local line_no=$2
    echo "[ERROR] Script failed with exit code $exit_code at line $line_no" | tee -a "$LOG_FILE"
    
    # Dump log file for debugging
    echo -e "\n=== Last 50 lines of log ($LOG_FILE) ==="
    tail -n 50 "$LOG_FILE" || true
    
    exit $exit_code
}

BL='\033[0;34m'
G='\033[0;32m'
RED='\033[0;31m'
YE='\033[1;33m'
NC='\033[0m' # No Color

# Default values
EMULATOR_NAME=${EMULATOR_NAME:-pixel}
EMULATOR_TIMEOUT=${EMULATOR_TIMEOUT:-600}  # 10 minutes timeout
ADB_TIMEOUT=30
MAX_BOOT_ATTEMPTS=3

function log() {
    echo -e "${BL}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

function log_error() {
    echo -e "${RED}[ERROR] $1${NC}" >&2
}

function check_required_vars() {
    log "=== Checking required environment variables ==="
    local required_vars=("ANDROID_HOME" "ANDROID_SDK_ROOT" "EMULATOR_NAME")
    local missing_vars=()
    
    # Log all environment variables for debugging
    log "Current environment:"
    env | sort
    
    # Ensure ANDROID_HOME and ANDROID_SDK_ROOT are set and point to the same directory
    if [[ -z "$ANDROID_HOME" || -z "$ANDROID_SDK_ROOT" ]]; then
        missing_vars+=("ANDROID_HOME" "ANDROID_SDK_ROOT")
    elif [[ "$ANDROID_HOME" != "$ANDROID_SDK_ROOT" ]]; then
        log "WARNING: ANDROID_HOME and ANDROID_SDK_ROOT point to different directories. Using ANDROID_HOME: $ANDROID_HOME"
        export ANDROID_SDK_ROOT="$ANDROID_HOME"
    fi
    
    # Verify the directory exists and has the required subdirectories
    if [[ ! -d "$ANDROID_HOME" ]]; then
        log_error "ANDROID_HOME directory does not exist: $ANDROID_HOME"
        log "Current directory contents:"
        ls -la "$(dirname "$ANDROID_HOME")" || true
        exit 1
    fi
    
    # Check for required subdirectories
    local required_dirs=("emulator" "platform-tools" "cmdline-tools")
    log "Checking required directories in $ANDROID_HOME"
    for dir in "${required_dirs[@]}"; do
        if [[ ! -d "$ANDROID_HOME/$dir" ]]; then
            log_error "Required directory not found: $ANDROID_HOME/$dir"
            log "Contents of $ANDROID_HOME:"
            ls -la "$ANDROID_HOME" || true
            exit 1
        fi
        log "Found directory: $ANDROID_HOME/$dir"
    done
    
    # Check for emulator binary
    local emulator_path="$ANDROID_HOME/emulator/emulator"
    if [[ ! -x "$emulator_path" ]]; then
        log_error "Emulator binary not found or not executable: $emulator_path"
        log "Contents of $ANDROID_HOME/emulator:"
        ls -la "$ANDROID_HOME/emulator" || true
        exit 1
    fi
    log "Found emulator binary: $emulator_path"
    
    # Check EMULATOR_NAME
    if [[ -z "$EMULATOR_NAME" ]]; then
        missing_vars+=("EMULATOR_NAME")
    fi
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        log_error "Missing required environment variables: ${missing_vars[*]}"
        exit 1
    fi
    
    # Log the final paths being used
    log "=== Environment verification successful ==="
    log "Using ANDROID_HOME: $ANDROID_HOME"
    log "Using ANDROID_SDK_ROOT: $ANDROID_SDK_ROOT"
    log "Using EMULATOR_NAME: $EMULATOR_NAME"
    log "Using EMULATOR_TIMEOUT: ${EMULATOR_TIMEOUT:-600}"
    log "Using ANDROID_AVD_HOME: ${ANDROID_AVD_HOME:-Not set}"
    
    # Verify AVD exists
    log "Verifying AVD: $EMULATOR_NAME"
    local avd_list
    avd_list=$("$ANDROID_HOME/emulator/emulator" -list-avds 2>&1) || {
        log_error "Failed to list AVDs. Error: $avd_list"
        exit 1
    }
    
    if ! echo "$avd_list" | grep -q "^$EMULATOR_NAME$"; then
        log_error "AVD '$EMULATOR_NAME' not found. Available AVDs:"
        echo "$avd_list"
        exit 1
    fi
    log "AVD found: $EMULATOR_NAME"
}

function check_emulator_binary() {
    if [[ ! -x "$ANDROID_HOME/emulator/emulator" ]]; then
        log_error "Emulator binary not found at $ANDROID_HOME/emulator/emulator"
        exit 1
    fi
}

function wait_for_emulator() {
    local start_time=$(date +%s)
    local timeout=${1:-${EMULATOR_TIMEOUT:-600}}  # Default to 600s if not set
    local boot_completed=0
    local attempts=0
    local max_attempts=$((timeout / 5))  # Check every 5 seconds
    
    log "Waiting for emulator to boot (timeout: ${timeout}s, max attempts: $max_attempts)..."
    
    # Wait for emulator to start up
    log "Waiting for emulator to start up..."
    local emulator_running=0
    for ((i=1; i<=max_attempts; i++)); do
        if ps -p $EMULATOR_PID > /dev/null; then
            emulator_running=1
            break
        fi
        sleep 5
        log "Waiting for emulator process to start... (attempt $i/$max_attempts)"
    done
    
    if [ $emulator_running -eq 0 ]; then
        log_error "Emulator process failed to start"
        log "=== Last 20 lines of emulator log ($LOG_FILE) ==="
        tail -n 20 "$LOG_FILE" || true
        exit 1
    fi
    
    log "Emulator process is running. Waiting for device to be ready..."
    
    local boot_success=0
    while [[ $(( $(date +%s) - start_time )) -lt $timeout ]]; do
        attempts=$((attempts + 1))
        
        # Check if emulator is still running
        if ! ps -p $EMULATOR_PID > /dev/null; then
            log_error "Emulator process died unexpectedly"
            log "=== Last 20 lines of emulator log ==="
            tail -n 20 "$LOG_FILE" || true
            exit 1
        fi
        
        # Try to get boot status
        local boot_status
        boot_status=$(adb -e shell getprop sys.boot_completed 2>&1 || true)
        
        # Check if boot completed
        if echo "$boot_status" | grep -q '1'; then
            boot_success=1
            break
        fi
        
        # Log progress every 5 attempts (25 seconds)
        if (( attempts % 5 == 0 )); then
            local elapsed=$(( $(date +%s) - start_time ))
            log "Waiting for emulator to boot... (${elapsed}s elapsed, status: $boot_status)"
            
            # Log adb devices for debugging
            log "Current ADB devices:"
            adb devices -l || true
            
            # Log emulator status
            log "Emulator process status:"
            ps -p $EMULATOR_PID -o %cpu,%mem,cmd || true
        fi
        
        sleep 5
    done
    
    if [[ $boot_success -eq 0 ]]; then
        log_error "Emulator failed to boot within $timeout seconds"
        log "=== Last 50 lines of emulator log ==="
        tail -n 50 "$LOG_FILE" || true
        log "=== ADB devices ==="
        adb devices -l || true
        log "=== System properties ==="
        adb shell getprop || true
        log "=== dmesg output ==="
        adb shell dmesg || true
        exit 1
    fi
    
    local boot_time=$(( $(date +%s) - start_time ))
    log "Emulator booted successfully in ${boot_time} seconds"
    
    # Wait for package manager to be ready
    log "Waiting for package manager to be ready..."
    local pm_ready=0
    for ((i=0; i<12; i++)); do  # Wait up to 1 minute
        if adb shell pm path android >/dev/null 2>&1; then
            pm_ready=1
            break
        fi
        sleep 5
    done
    
    if [[ $pm_ready -eq 0 ]]; then
        log_error "Package manager not ready after 1 minute"
        exit 1
    fi
    
    log "Package manager is ready"
}

function launch_emulator() {
    log "Starting emulator ${EMULATOR_NAME}..."
    
    # Set environment variables to control emulator behavior
    export QEMU_AUDIO_DRV=none
    export QT_QPA_PLATFORM=offscreen
    export ANDROID_EMU_HYPERVISOR=0  # Disable hypervisor
    export ANDROID_EMU_HYPERVISOR_FEATURES=0
    export ANDROID_EMULATOR_USE_SYSTEM_LIBS=1
    export ANDROID_EMULATOR_VIRTUAL_SENSORS=0
    export ANDROID_EMULATOR_LAUNCH_HEADLESS=1
    
    # Force x86_64 architecture and disable all acceleration
    local emulator_cmd=(
        "$ANDROID_HOME/emulator/emulator"
        -avd "$EMULATOR_NAME"
        -no-audio
        -no-window
        -no-boot-anim
        -no-snapshot-save
        -gpu swiftshader_indirect
        -camera-back none
        -camera-front none
        -no-snapshot
        -memory 2048
        -partition-size 2048
        -netfast
        -verbose
        -no-accel
        -feature HVF=0
        -feature GLESDynamicVersion=on
        -feature AllowSnapshotMigration
        -no-snapstorage
        -no-snapshot-update-time
        -no-jni
        -no-boot-anim
        -no-window-anim
        -no-sim
        -no-passive-gps
        -no-snapshot-load
        -qemu -cpu host
        -qemu -machine type=ranchu,accel=off
    )
    
    # Export environment variables for better performance
    export QEMU_AUDIO_DRV=none
    export QT_QPA_PLATFORM=offscreen
    
    # Create a log file for emulator output
    local log_file="$ANDROID_AVD_HOME/emulator_${EMULATOR_NAME}.log"
    
    # Start the emulator in the background with logging
    "${emulator_cmd[@]}" > "$log_file" 2>&1 &
    EMULATOR_PID=$!
    
    # Give it a moment to start
    sleep 5
    
    # Check if the emulator process is still running
    if ! ps -p $EMULATOR_PID > /dev/null; then
        log_error "Emulator process failed to start. Check the log file: $log_file"
        log_error "Last 20 lines of emulator log:"
        tail -n 20 "$log_file" >&2
        return 1
    fi
    
    log "Emulator started with PID: $EMULATOR_PID"
    
    # Wait for the emulator to be ready
    wait_for_emulator "$EMULATOR_TIMEOUT" || {
        log_error "Failed to start emulator. Check the log file: $log_file"
        log_error "Last 20 lines of emulator log:"
        tail -n 20 "$log_file" >&2
        kill -9 $EMULATOR_PID 2>/dev/null || true
        return 1
    }
    
    # Additional setup after boot
    log "Setting up emulator..."
    adb wait-for-device
    
    # Disable animations
    adb shell settings put global window_animation_scale 0
    adb shell settings put global transition_animation_scale 0
    adb shell settings put global animator_duration_scale 0
    
    # Set timezone
    adb shell setprop persist.sys.timezone "UTC"
    
    # Unlock the screen
    adb shell input keyevent 82
    
    log "Emulator is ready!"
    return 0
}

function check_emulator_status () {
  printf "${G}==> ${BL}Checking emulator booting up status 🧐${NC}\n"
  start_time=$(date +%s)
  spinner=( "⠹" "⠺" "⠼" "⠶" "⠦" "⠧" "⠇" "⠏" )
  i=0
  # Get the timeout value from the environment variable or use the default value of 300 seconds (5 minutes)
  timeout=${EMULATOR_TIMEOUT:-300}

  while true; do
    result=$(adb shell getprop sys.boot_completed 2>&1)

    if [ "$result" == "1" ]; then
      printf "\e[K${G}==> \u2713 Emulator is ready : '$result'           ${NC}\n"
      adb devices -l
      adb shell input keyevent 82
      echo "Emulator started successfully!"
      return 0
    elif [ "$result" == "" ]; then
      printf "${YE}==> Emulator is partially Booted! 😕 ${spinner[$i]} ${NC}\r"
    else
      printf "${RED}==> $result, please wait ${spinner[$i]} ${NC}\r"
      i=$(( (i+1) % 8 ))
    fi

    current_time=$(date +%s)
    elapsed_time=$((current_time - start_time))
    if [ $elapsed_time -gt $timeout ]; then
      printf "${RED}==> Timeout after ${timeout} seconds elapsed 🕛.. ${NC}\n"
      echo "##[error]Emulator failed to start within the timeout period"
      exit 1
    fi
    sleep 4
  done
};

function disable_animation() {
  adb shell "settings put global window_animation_scale 0.0"
  adb shell "settings put global transition_animation_scale 0.0"
  adb shell "settings put global animator_duration_scale 0.0"
};

    function disable_animation() {
      adb shell "settings put global window_animation_scale 0.0"
      adb shell "settings put global transition_animation_scale 0.0"
      adb shell "settings put global animator_duration_scale 0.0"
    };

    function hidden_policy() {
      adb shell "settings put global hidden_api_policy_pre_p_apps 1;settings put global hidden_api_policy_p_apps 1;settings put global hidden_api_policy 1"
    };

    function main() {
        log "=== Android Emulator Startup Script ==="
        log "Timestamp: $(date)"
        
        # Check for required variables and binaries
        check_required_vars
        check_emulator_binary
        
        # Launch the emulator
        launch_emulator
        
        # Verify the emulator is accessible
        log "Verifying emulator accessibility..."
        if ! adb devices | grep -q emulator; then
            log_error "No emulator found in adb devices"
            log "ADB devices:"
            adb devices -l || true
            exit 1
        fi
        
        # Get the emulator serial
        local emulator_serial
        emulator_serial=$(adb devices | grep emulator | awk '{print $1}' | head -n 1)
        
        if [ -z "$emulator_serial" ]; then
            log_error "Failed to get emulator serial number"
            exit 1
        fi
        
        log "Emulator is running with serial: $emulator_serial"
        log "=== Emulator Information ==="
        adb -s "$emulator_serial" shell getprop | grep -E 'ro.build.version|ro.product.model|ro.bootimage.build.fingerprint' || true
        
        # Keep the container running
        log "=== Emulator is ready! ==="
        log "To connect: adb -s $emulator_serial shell"
        log "Log file: $LOG_FILE"
        log "Press Ctrl+C to stop the emulator"
        
        # Handle graceful shutdown
        trap 'shutdown_emulator' INT TERM
        
        # Keep the script running
        while true; do
            # Check if emulator is still running
            if ! ps -p "$EMULATOR_PID" > /dev/null 2>&1; then
                log_error "Emulator process (PID: $EMULATOR_PID) has stopped unexpectedly"
                log "=== Last 20 lines of log ==="
                tail -n 20 "$LOG_FILE" || true
                exit 1
            fi
            
            # Check if emulator is responding
            if ! adb -s "$emulator_serial" shell echo "ping" >/dev/null 2>&1; then
                log_error "Emulator is not responding to ADB commands"
                log "=== Last 20 lines of log ==="
                tail -n 20 "$LOG_FILE" || true
                exit 1
            fi
            
            sleep 5
        done
    }

    # Function to gracefully shut down the emulator
    shutdown_emulator() {
        log "\nShutting down emulator..."
        
        # Try to gracefully shut down the emulator
        if [ -n "$emulator_serial" ]; then
            log "Sending shutdown command to emulator $emulator_serial..."
            adb -s "$emulator_serial" emu kill || true
        fi
        
        # Kill the emulator process if it's still running
        if [ -n "$EMULATOR_PID" ] && ps -p "$EMULATOR_PID" > /dev/null; then
            log "Force killing emulator process $EMULATOR_PID..."
            kill -9 "$EMULATOR_PID" 2>/dev/null || true
        fi
        
        log "Emulator shutdown complete"
        exit 0
    }

    # Run the main function
    main "$@"
