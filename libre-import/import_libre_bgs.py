#!/usr/bin/python3

import argparse
import time
from datetime import datetime, timedelta
import json
from collections import OrderedDict
import os
from shutil import copy
import sys
import platform

csvDir = "../user-data/bg-csv"
jsonDir = "../user-data/bg-json"
bgDirOnPhone = "ddiary/bg"

bgValues = {}
options = 0
timezoneOffset = 0

def main():
    parseArguments()
    setupTimezone()
    libreSoftwareExportCsv()
    readCsv(options.inputFilename)
    writeJsonDayFiles()
    copyJsonFilesToPhone()

def parseArguments():
    global options
    parser = argparse.ArgumentParser()
    parser.add_argument('inputFilename', nargs='?',
                        default=os.path.join(csvDir, "{}.csv".format(time.strftime("%Y-%m-%d"))),
                        help="csv input file name, exported from libre software")
    parser.add_argument('initTimezoneOffset', nargs='?', type=int, default=-60,
                         help="initial timezone offset in minutes (default: germany in winter: -60)")
    parser.add_argument('phoneDirectory', nargs='?', default="F:/",
                         help="path to phone sd card, default: F:/")
    options = parser.parse_args()

def setupTimezone():
    global timezoneOffset
    timezoneOffset = options.initTimezoneOffset

def libreSoftwareExportCsv():
    csvDirAbsolute = os.path.normpath(os.path.join(os.path.dirname(os.path.realpath(__file__)), csvDir))
    try:
        os.system("wscript.exe ./libre_save_csv.vbs \"{}\\\"".format(csvDirAbsolute))
    except e:
        print("Warning: could not launch libre csv exporter")

def readCsv(fileName):
    file = open(fileName, 'r')
    count = 0
    for line in file:
        line_split = line[:-1].split("\t")
        if isHistoricGlucoseEntry(line_split):
            registerValue(line_split[1], line_split[3])
            count += 1
        if isDeviceClockAdjustment(line_split):
            adjustTimezoneIfNecessary(line_split)
    print("Read {} values from CSV {}".format(count, fileName))

def isHistoricGlucoseEntry(line_split):
    return len(line_split) > 2 and line_split[2] == '0'

def registerValue(timeStringLocal, valueString):
    bgValue = valueString.replace(',','.')
    bgTimeLocal = parseDateString(timeStringLocal)
    bgTimeUTC = bgTimeLocal + timedelta(minutes=timezoneOffset)
    valueObject = {
        'bgValue': bgValue,
        'timezoneOffset': timezoneOffset,
        'date': bgTimeUTC.strftime("%Y-%m-%dT%H:%M:%S.000Z") #2016-01-23T05:20:00.000Z
    }
    day = bgTimeUTC.strftime("%Y-%m-%d")
    if not day in bgValues:
        bgValues[day] = []
    bgValues[day].append(valueObject)

def isDeviceClockAdjustment(line_split):
    return len(line_split) > 2 and line_split[2] == '6'

def adjustTimezoneIfNecessary(line_split):
    global timezoneOffset
    dateBefore = parseDateString(line_split[17])
    dateAfter = parseDateString(line_split[18])
    delta = dateAfter - dateBefore
    deltaMinutes = delta.total_seconds() / 60
    deltaMinutesRounded = roundTo(deltaMinutes, 30)
    if abs(deltaMinutes) > 20:
        print("timezone change from", timezoneOffset, "to", timezoneOffset - deltaMinutesRounded, "at", dateBefore)
        timezoneOffset -= deltaMinutesRounded

def roundTo(x, base):
    return int(base * round(float(x)/base))

def parseDateString(dateString):
    return datetime.strptime(dateString, "%Y.%m.%d %H:%M") #2016.02.28 21:40

def writeJsonDayFiles():
    createDirectoryIfMissing(jsonDir)
    count = 0
    for day in bgValues:
        count += 1
        writeJsonDayFile(day, bgValues[day])
    print("Wrote {} day files".format(count))

def writeJsonDayFile(day, valuesForDay):
    valuesSorted = sorted(valuesForDay, key=lambda t: t['date'])
    fileContent = json.dumps(valuesSorted).replace('},','},\n')
    filename = os.path.join(jsonDir, "bg_{}.json".format(day))
    with open(filename, 'w') as file:
        file.write(fileContent)

def copyJsonFilesToPhone():
    disableWindowsDriveErrorMessage()
    waitForPhoneConnection()
    count = 0
    if isPhoneConnected():
        createDirectoryIfMissing(os.path.join(options.phoneDirectory, bgDirOnPhone))
        for fileName in os.listdir(jsonDir):
            copy(os.path.join(jsonDir, fileName), os.path.join(options.phoneDirectory, bgDirOnPhone))
            count += 1
        print("Copied {} files to Phone at {}".format(count, os.path.join(options.phoneDirectory, bgDirOnPhone)))
    else:
        print("Phone not connected, did not copy any files.")

def waitForPhoneConnection():
    if not isPhoneConnected():
        print("Waiting for phone connection", end="")
    tries = 30
    while not isPhoneConnected() and tries > 0:
        print(".", end="")
        sys.stdout.flush()
        tries -= 1
        time.sleep(1)
    print("")

def isPhoneConnected():
    return os.path.exists(options.phoneDirectory)

def disableWindowsDriveErrorMessage():
    try:
        import ctypes
        kernel32 = ctypes.WinDLL('kernel32')
        SEM_FAILCRITICALERRORS = 1
        SEM_NOOPENFILEERRORBOX = 0x8000
        SEM_FAIL = SEM_NOOPENFILEERRORBOX | SEM_FAILCRITICALERRORS
        oldmode = ctypes.c_uint()
        kernel32.SetThreadErrorMode(SEM_FAIL, ctypes.byref(oldmode))
    except e:
        print("Warning: could not disable windows drive error messages: ", e)

def createDirectoryIfMissing(path):
    if not os.path.exists(path):
        os.makedirs(path)

if __name__ == '__main__':
    main()
