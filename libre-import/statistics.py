#!/usr/bin/python3

import argparse
import time
from datetime import datetime, timedelta
import json
import os

def main():
    filename = "../user-data/bg-csv/{}.csv".format(time.strftime("%Y-%m-%d"))
    file = open(options.inputFilename, 'r')

    lowestValue = 50
    highestValue = 0

    for line in file:
        line_split = line.split("\t")
        if isHistoricGlucoseEntry(line_split):
            value = float(line_split[3].replace(',','.'))
            if value < lowestValue:
                lowestValue = value
            if value > highestValue:
                highestValue = value

    print("lowest: ", lowestValue)
    print("highest: ", highestValue)


def isHistoricGlucoseEntry(line_split):
    return len(line_split) > 2 and line_split[2] == '0'

if __name__ == '__main__':
    main()
