from flask import Flask, jsonify
import serial

app = Flask(__name__)

ser = serial.Serial('COM5', 115200, timeout=1)  # CHANGE COM PORT IF NEEDED

zoneA = 0
zoneB = 0
occupancy = 0

@app.route("/data")
def data():
    global zoneA, zoneB, occupancy
    if ser.in_waiting:
        line = ser.readline().decode().strip()
        if line.startswith("DATA:"):
            parts = line.replace("DATA:", "").split(",")
            zoneA = int(parts[0])
            zoneB = int(parts[1])
            occupancy = int(parts[2])
    return jsonify({
        "zoneA": zoneA,
        "zoneB": zoneB,
        "occupancy": occupancy
    })

if __name__ == "__main__":
    app.run(debug=True)
