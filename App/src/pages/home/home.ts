import { Component, NgZone } from '@angular/core';
import { NavController, Platform, AlertController, NavParams, ToastController } from 'ionic-angular';

import { DevicePage } from '../device/device';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})

//Classe HomePage
//Classe permettant de gérer l'ensemble de la recherche et de la connection bluetooth
export class HomePage {

	isScanning: boolean;
	pairedDevices: any;
	unpairedDevices: any;
	_zone: any;
	translate: any;
	connecting: boolean;
	peripheral: any = {};

	//Constructeur de la classe HomePage
	//ToastController : classe permettant d'afficher des messages d'une certaine durée à l'écran
	//NavController : classe permettant de naviguer entre les pages 
	//AlertController : classe permttant d'afficher de fenêtres pop-up à l'écran 
	//BluetoothSerial : plugin permettant de gérer la connection bluetooth
	//Platform : permet d'avoir des informations sur le device (OS, lorsqu'il est pret,... 	)
	constructor(private toastCtrl: ToastController, public navParams: NavParams, public navCtrl: NavController, public alertCtrl: AlertController, private bluetoothSerial: BluetoothSerial, public plt: Platform, _zone: NgZone) {
		this._zone = _zone;
		this.isScanning = false;
		this.unpairedDevices = [];
		this.pairedDevices = [];
		//On récupère la langue choisie
		this.translate = this.navParams.get('translate');
	}

	//Fonction ionViewDidEnter (lancée lorsque la page à été chargé)
	//Entrée : --
	//Sortie : --
	//Rôle : permet d'informer que l'on est bien rentré dans la page et de tester le bluetooth 
	//		 s'il est activé, de lancer la recherche de device
	//		 s'il est inactivé, de proposer à l'utilisateur de l'activer
	ionViewDidEnter() {
		this.plt.ready().then((readySource) => {
			console.log('Platform ready from', readySource);
			this.bluetoothSerial.isEnabled().then((success) => {
				console.log('BT is enable :' + success);
				this.discoverUnpairedDevices();
			}, (failure) => {
				console.log('BT is disable :' + failure);
				this.enableBT();
			});
			this.plt.registerBackButtonAction(() => {
				this.plt.exitApp();
			});
		});
	}

	//Fonction checkBTOn
	//Entrée : --
	//Sortie : --
	//Rôle : permet de regarder si le bluetooth est bien activé. Si non, de proposé à l'utilisateur de l'activer
	checkBTOn() {
		this.bluetoothSerial.isEnabled().then((success) => {
			console.log('BT is enable :' + success);
		}, (failure) => {
			console.log('BT is disable :' + failure);
			this.enableBT();
		});
	}

	//Fonction refreshList
	//Entrée : --
	//Sortie : --
	//Rôle : permet de rafraîchir la liste d'appareils ayant le bluetooth activée 
	refreshList() {
		console.log("refreshing list");
		this.bluetoothSerial.list().then((result) => {
			console.log("list successfully refreshed");
			console.log(result);
			this.pairedDevices = result;
		}, (failure) => {
			console.log("list cant be refreshed :" + failure);
			this.pairedDevices = [];
		});
	}

	//Fonction enableBT
	//Entrée : --
	//Sortie : --
	//Rôle : Permet de demander à l'utilisateur d'activer son bluetooth
	enableBT() {
		console.log('enabling BT');
		this.bluetoothSerial.enable().then((success) => {
			console.log('BT was successfully enable :' + success);
			this.discoverUnpairedDevices();
		}, (failure) => {
			console.log('BT can\'t be enable :' + failure);
		});
	}

	//Fonction goToPageDevice
	//Entrée : device
	//Sortie : --
	//Rôle : Permet de se connecter au device choisi puis de charger la page DevicePage
	goToPageDevice(device) {
		this.bluetoothSerial.isEnabled().then((success) => {
			console.log('BT is enable :' + success);
			this.bluetoothSerial.connect(device.id).subscribe(
				peripheral => this.onConnected(peripheral, device),
				peripheral => this.onDeviceDisconnected(peripheral)
			)
		}, (failure) => {
			console.log('BT is disable :' + failure);
			this.enableBT();
		});
	}

	//Fonction onConnected
	//Entrée : peripheral, device
	//Sortie : --
	//Rôle : permet de charger la page du device (DevicePage)
	onConnected(peripheral, device) {
		this.connecting = true;
		this._zone.run(() => {
			this.peripheral = peripheral;
		});
		this.navCtrl.push(DevicePage, {
			device: device,
			translate: this.translate
		});

	}


	//Fonction onDeviceDisconnected
	//Entrée : peripheral
	//Sortie : --
	//Rôle : permet d'informer l'utilisateur que l'application s'est déconnectée du device
	onDeviceDisconnected(peripheral) {
		let msg = "";
		if (this.translate.currentLang == 'en') {
			msg = 'The peripheral unexpectedly disconnected';
		}
		if (this.translate.currentLang == 'fr') {
			msg = 'Le périphérique s\'est déconnecté de manière inattendue';
		}
		if (this.translate.currentLang == 'de') {
			msg = 'Das Peripheriegerät wurde unerwartet getrennt';
		}
		let toast = this.toastCtrl.create({
			message: msg,
			duration: 3000,
			position: 'middle'
		});
		toast.present();
		this.connecting = false;
	}

	//Fonction discoverUnpairedDevices
	//Entrée : --
	//Sortie : --
	//Rôle : permet de trouver l'ensemble des appareils ayant le bluetooth activé
	discoverUnpairedDevices() {
		this.bluetoothSerial.isEnabled().then((success) => {
			console.log('BT is enable :' + success);
			this.refreshList();
			this.isScanning = true;
			this.unpairedDevices = [];
			this.bluetoothSerial.setDeviceDiscoveredListener().subscribe((device) => {
				// the same scanned device is found multiple times
				console.log('Found: ' + device.id);
				this._zone.run(() => {
					this.unpairedDevices.push(device);
				});
			});

			this.bluetoothSerial.discoverUnpaired().then((unpairedDevices) => {
				console.log("appel a discoverUnpaired");
				this.isScanning = false;
			});
		}, (failure) => {
			console.log('BT is disable :' + failure);
			this.enableBT();
		});
	}

	//Fonction popView
	//Entrée : --
	//Sortie : --
	//Rôle : permet de décharger la page
	popView() {
		this.navCtrl.pop();
	}


}
