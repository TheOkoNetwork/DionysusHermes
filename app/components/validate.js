import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import config from '../config/environment';
import ScanditSDK from 'scandit-sdk';

export default class SingleDemo extends Component {
  @tracked cameraStream;
  @tracked scanProvider = 'scandit';
  @tracked scanditScanner;
  @tracked lastDetectedData;
  @service audio;
  @service msal;
  @tracked lastScanResult = '';
  @tracked lastScanFailure = false;
  @tracked lastScanSuccess = false;
  @tracked lastScanSpecial = false;

  get isCameraActive() {
    switch (this.scanProvider) {
      case 'scandit':
        return this.scanditScanner !== undefined;
      case 'emberqr':
        return this.cameraStream !== undefined;
      default:
        return false;
    }
  }

  @action
  async toggleCamera() {
    this.isCameraActive ? this.stop() : await this.start();
  }

  @action
  pauseCamera() {
    switch (this.scanProvider) {
      case 'scandit':
        this.scanditScanner.pauseScanning(true);
        this.scanditScanner.setVisible(false);
        break;
      case 'emberqr':
        var tracks = this.cameraStream.getTracks();

        for (var i = 0; i < tracks.length; i++) {
          var track = tracks[i];
          track.enabled = false;
        }
        break;
    }
  }
  @action
  resumeCamera() {
    switch (this.scanProvider) {
      case 'scandit':
        this.scanditScanner.resumeScanning();
        this.scanditScanner.setVisible(true);
        return;
      case 'emberqr':
        var tracks = this.cameraStream.getTracks();

        for (var i = 0; i < tracks.length; i++) {
          var track = tracks[i];
          track.enabled = true;
        }
        break;
    }
  }

  @tracked validating = false;
  @action
  async handleData(data) {
    if (data.replace(/[^A-Za-z0-9]/gi, '').length === 0) {
      return;
    }
    if (this.validating) {
      console.log('Already validating a ticket, ignoring new data');
      return;
    } else {
      this.validating = true;
    }
    this.lastDetectedData = data;
    this.pauseCamera();
    this.audio.getSound('scan').play();
    this.lastScanResult = 'Validating with Olympus';
    console.log(`Checking with server if: ${data} is a valid ticket`);
    this.lastScanSuccess = false;
    this.lastScanFailure = false;
    this.lastScanSpecial = false;

    const scanResult = await fetch(`${config.OLYMPUS}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await this.msal.idToken()}`,
      },
      body: JSON.stringify({
        barcode: data,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .catch((reason) => {
        console.log('rejected', reason);
        console.log('Network failure');
        console.log('Resetting scanner mode');
        this.audio.getSound('networkFailure').play();
        this.validating = false;
        this.lastScanResult = 'Network failure';
        this.resumeCamera();
        this.lastScanFailure = true;
      });
    if (scanResult.status) {
      console.log('Scan result is:', scanResult);
      this.lastScanResult = scanResult.message;
      if (scanResult.special) {
        this.lastScanSpecial = true;
        this.audio.getSound('special').play();
        window.alert(scanResult.specialMessage);
      } else {
        this.lastScanSuccess = true;
        this.audio.getSound('success').play();
      }
    } else {
      console.log('Scan result is:', scanResult);
      if (scanResult.cancelled) {
        this.audio.getSound('cancelled').play();
      } else {
        this.audio.getSound('fail').play();
      }
      this.lastScanResult = scanResult.message;
      this.lastScanFailure = true;
    }
    this.validating = false;
    this.resumeCamera();
  }

  async start() {
    this.audio.load('fail.mp3').asSound('fail');
    this.audio.load('scan.mp3').asSound('scan');
    this.audio.load('networkFailure.mp3').asSound('networkFailure');
    this.audio.load('success.mp3').asSound('success');
    this.audio.load('special.mp3').asSound('special');
    this.audio.load('cancelled.mp3').asSound('cancelled');

    await ScanditSDK.configure(
      'AceBbxs+OSKwL4B32gGxF9IgknlWGPYBDlgXOuVFqH2pOPL/dlt/uRNwF2XMdCX5Wn8WXuRJQfrHS7TpCn4vxytBZLLkVnGRglHZlZskn6uSUvWoeEwINvUOZQq7dUtcIHhoH3k6ZjMXfElFg3RynhB54PjkKVcdGwWDY11hLBiSXXvZ+H9LFhtEl+yURHDbiFzFNgQcMCn+av4lMmBVCmRygWXILYr3QHHn6EJa6J+NT2mrrzYmSzVQB27fGy9VnxNPjGUXFIqJJhkLn32y8Kjy6VbgBsmnixLkvUVNTwgKgwAILeyNVg8A6iEGhwZKJJLcDkInrrQ2ToAfXDNBC6+YPGPNt17P2iO6gQyKPF5xepARsM1l85IyuhG8P7sYuCJfFKGGq/JL/p6cdSG6Lg2/4Xu+j0U6FVesit45c28Li2d1xi88AOVFMZTTrrjHgD4u++GhPpwSYJkOOc6jLvYikz9k0xmxjVYr61Fc3WYTCDt43xDAcmvGiTymUv94ElS7rrsz8mE2ED5oqkn3jyKgKLswvQgBaPlmEGMdgPuxkCJTqiv3oVmGJ5YfiWCqVEbcupuvlnN2SJoeeIVtLyqmrPkO1mZt7nafDV8Mi9o3/n3X0OQOpGYB+733fabGjP8cLTLaanpuRAI18Y++PaaLBnXRS/fwCnfy8SMprYPCAvnpIT7gYhzLu3OIE7s93UBo0gPiGMyd3m6CLYfuEvmZJlVTegqx0C+WG0v7QFbAVMQk8trymFMPdFccdmIaFh4ZVAvmEAeH4OA7SjJPNcrM9yf5ZDTfuxyMuvoJWkqaV0jBEBvj8XxYvWbINbprJeSRrVL6+C8f4yrCxiE9o0cYXv0dgIbvV7y5UMlpHTKNa52Haz2e55AWDjyRhR5VLYoKJXSFwF+gTmcNQzx6ZKD8e/8Ml0q7UbRu6eOloBchWVmloA/MAiZKDTI=',
      {
        engineLocation: 'https://cdn.jsdelivr.net/npm/scandit-sdk@5.x/build/',
      }
    );
    this.scanditScanner = await ScanditSDK.BarcodePicker.create(
      document.getElementById('scandit-barcode-picker'),
      {
        playSoundOnScan: true,
        vibrateOnScan: true,
        // enable some common symbologies
        scanSettings: new ScanditSDK.ScanSettings({
          enabledSymbologies: [
            'ean8',
            'ean13',
            'upca',
            'upce',
            'qr',
            'code128',
          ],
        }),
      }
    );
    this.scanditScanner.on('scan', (scanResult) => {
      //          alert(scanResult.barcodes[0].data);
      this.handleData(scanResult.barcodes[0].data);
    });

    /*
    console.log('Starting stream');
    let options = { video: { facingMode: 'environment' } };
    let stream = await navigator.mediaDevices.getUserMedia(options);
    console.log('Got stream');
    this.cameraStream = stream;
    */
  }

  stop() {
    switch (this.scanProvider) {
      case 'scandit':
        this.scanditScanner.destroy(true);
        this.scanditScanner = undefined;
        break;
      case 'emberqr':
        this.cameraStream?.getTracks().forEach((track) => track.stop());
        this.cameraStream = undefined;
        break;
      default:
        return false;
    }
  }
}
