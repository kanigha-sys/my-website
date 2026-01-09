from flask import Flask, render_template, jsonify
import serial
import threading

app = Flask(__name__)

# CHANGE COM PORT IF NEEDED
arduino = serial.Serial('COM5', 115200, timeout=1)

zoneA = 0
zoneB = 0
occupancy = 0

def read_serial():
    global zoneA, zoneB, occupancy
    while True:
        line = arduino.readline().decode().strip()
        if line.startswith("DATA:"):
            try:
                data = line.replace("DATA:", "").split(",")
                zoneA = int(data[0])
                zoneB = int(data[1])
                occupancy = int(data[2])
            except:
                pass

threading.Thread(target=read_serial, daemon=True).start()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/data")
def data():
    return jsonify({
        "zoneA": zoneA,
        "zoneB": zoneB,
        "occupancy": occupancy
    })

if __name__ == "__main__":
    app.run(debug=True)

