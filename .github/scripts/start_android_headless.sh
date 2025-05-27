#!/bin/bash

set -e  # Exit on any error

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
    local required_vars=("ANDROID_HOME" "ANDROID_SDK_ROOT" "EMULATOR_NAME")
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            missing_vars+=("$var")
        fi
    done
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        log_error "Missing required environment variables: ${missing_vars[*]}"
        exit 1
    fi
}

function check_emulator_binary() {
    if [[ ! -x "$ANDROID_HOME/emulator/emulator" ]]; then
        log_error "Emulator binary not found at $ANDROID_HOME/emulator/emulator"
        exit 1
    fi
}

function wait_for_emulator() {
    local start_time=$(date +%s)
    local timeout=${1:-$EMULATOR_TIMEOUT}
    local boot_completed=0
    local attempts=0
    
    log "Waiting for emulator to boot (timeout: ${timeout}s)..."
    
    while [[ $(( $(date +%s) - start_time )) -lt $timeout ]]; do
        if adb -s emulator-5554 shell "getprop sys.boot_completed" 2>/dev/null | grep -q "1"; then
            boot_completed=1
            break
        fi
        
        # Check if emulator process is still running
        if ! pgrep -f "@${EMULATOR_NAME}" > /dev/null; then
            log_error "Emulator process not found. It might have crashed."
            return 1
        fi
        
        attempts=$((attempts + 1))
        if [[ $((attempts % 10)) -eq 0 ]]; then
            log "Still waiting for emulator to boot... (${attempts} attempts)"
        fi
        
        sleep 5
    done
    
    if [[ $boot_completed -eq 1 ]]; then
        log "Emulator booted successfully!"
        return 0
    else
        log_error "Emulator failed to boot within ${timeout} seconds"
        return 1
    fi
}

function launch_emulator() {
    log "Starting emulator ${EMULATOR_NAME}..."
    
    # Check required variables
    check_required_vars
    check_emulator_binary
    
    # Clean up any existing emulator instances
    log "Killing any existing emulator instances..."
    adb devices | grep emulator | cut -f1 | xargs -I {} adb -s "{}" emu kill || true
    pkill -9 qemu-system-aarch64 || true
    pkill -9 emulator || true
    
    # Wait for the emulator to fully shut down
    sleep 5
    
    # Set performance options
    local options=(
        "-no-window"
        "-no-snapshot"
        "-noaudio"
        "-memory 4096"
        "-no-boot-anim"
        "-camera-back none"
        "-no-snapshot-save"
        "-wipe-data"
        "-gpu swiftshader_indirect"
        "-feature -GLESDynamicVersion"
        "-no-accel"
        "-qemu"
        "-cpu host"
        "-s 4"
        "-m 4G"
        "-l 2G"
        "-enable-kvm"
        "-partition-size 2048"
        "-no-snapshot-load"
        "-skip-adb-auth"
        "-no-passive-gps"
        "-no-snapshot-save"
        "-no-snapshot"
        "-no-sim"
    )
    
    # Export environment variables for better performance
    export QEMU_AUDIO_DRV=none
    export QT_QPA_PLATFORM=offscreen
    
    # Start the emulator in the background
    log "Starting emulator with command: $ANDROID_HOME/emulator/emulator -avd $EMULATOR_NAME ${options[*]}"
    "$ANDROID_HOME/emulator/emulator" -avd "$EMULATOR_NAME" "${options[@]}" >/dev/null 2>&1 &
    EMULATOR_PID=$!
    
    # Wait for the emulator to be ready
    wait_for_emulator "$EMULATOR_TIMEOUT" || {
        log_error "Failed to start emulator"
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
  
  # Additional environment variables for better emulator performance
  export QEMU_AUDIO_DRV=none
  export QT_QPA_PLATFORM=offscreen
  
  # Start the emulator
  nohup emulator $options &

  if [ $? -ne 0 ]; then
    echo "Error launching emulator"
    return 1
  fi
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

function hidden_policy() {
  adb shell "settings put global hidden_api_policy_pre_p_apps 1;settings put global hidden_api_policy_p_apps 1;settings put global hidden_api_policy 1"
};

# Main execution
launch_emulator
sleep 2
check_emulator_status
sleep 1
disable_animation
sleep 1
hidden_policy
sleep 1

echo "✅ Emulator setup complete"
