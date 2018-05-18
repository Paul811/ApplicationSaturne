import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform, AlertController, ToastController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { ZenPage } from '../zen/zen';
import { SettingsPage } from '../settings/settings';
import { diffuseur } from './diffuseur';

/**
 * Generated class for the DevicePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */



@Component({
	selector: 'page-device',
	templateUrl: 'device.html',
})




export class DevicePage {

	connecting: boolean;
	device: any;
	active: any;
	peripheral: any = {};
	statusMessage: string;
	arrayDevice: any[] = [];
	progDispo: any[];
	autreProgDispo: any[];
	diffuseur1: any;
	tabDiffuseur: any[] = [];
	translate: any;
	playZen : boolean;
	pauseZen : boolean;


	//Constructeur de la classe DevicePage
	//ToastController : classe permettant d'afficher des messages d'une certaine durée à l'écran
	//NavController : classe permettant de naviguer entre les pages 
	//AlertController : classe permttant d'afficher de fenêtres pop-up à l'écran
	//NavParams : classe permettant de d'envoyer ou de récuperer des parametres  
	//BluetoothSerial : plugin permettant de gérer la connection bluetooth
	//Platform : permet d'avoir des informations sur le device (OS, lorsqu'il est pret,... 	)
	constructor(private ngZone: NgZone, private toastCtrl: ToastController, public navCtrl: NavController, private alertCtrl: AlertController, public navParams: NavParams, private bluetoothSerial: BluetoothSerial, public plt: Platform) {
		//Initialisation des variables
		this.connecting = false;
		this.playZen = true;
		this.pauseZen = false;
		//On récupère le device que l'on a choisi
		this.device = this.navParams.get('device');
		//On récupère la langue choisie
		this.translate = this.navParams.get('translate');
		//On déclare le diffuseur 
		this.diffuseur1 = new diffuseur(this.device, "", 2000, this.progDispo, this.device.name, 200, 3);
		//On ajoute le diffuseur dans le tableau des diffuseurs
		this.tabDiffuseur.push(this.diffuseur1);

	}

	//Fonction popView
	//Entrée : --
	//Sortie : --
	//Rôle : Se déconnecter du device et décharger la page (revenir à la page précédente)
	popView() {
		console.log('ionViewWillLeave disconnecting Bluetooth');
		this.bluetoothSerial.disconnect().then(
			() => console.log('Disconnected ' + JSON.stringify(this.peripheral)),
			() => console.log('ERROR disconnecting ' + JSON.stringify(this.peripheral))
		)
		this.navCtrl.pop()
	};

	//Fonction ionViewWillEnter (fonction appelé lorsque l'on charge la page)
	//Entrée : --
	//Sortie : --
	//Rôle : Permet de récupérer le nouveau nom du diffuseur s'il a été changé 
	//       Permet de récupérer l'état de diffusion (pause ou play)
	ionViewWillEnter() {
		this.diffuseur1.setNomDiffuseur(this.navParams.get('newTitle') || this.diffuseur1.getNomDiffuseur());
		this.getName();
		if(this.navParams.get('pauseZen') != null)
		{ 
			this.pauseZen = (this.navParams.get('pauseZen'));
			this.playZen =  !this.pauseZen;
		}
	}

	//Fonction goToPage
	//Entrée : Programme choisi et device choisi
	//Sortie : --
	//Rôle : Permet de charger la page selon le programme choisi
	goToPage(prog, device) {
		if (prog.name == 'Zen') {
			this.ngZone.run(() => {
				this.navCtrl.push(ZenPage, {
					device: device,
					translate: this.translate,
					playZen : this.playZen,
					pauseZen : this.pauseZen
				});
			});
		}
	}

	//Fonction addProg
	//Entrée : programme choisi
	//Sortie : --
	//Rôle : Permet d'ajouter un programme à la liste des programmes de l'utilisateur
	addProg(prog) {
		let tle = "";
		let msg = "";
		let yes = "";
		let no = "";
		if (this.translate.currentLang == 'en') {
			tle = "Confirm"
			msg = 'Do you want to add this program to your programs ?';
			yes = "Yes";
			no = "No";
		}
		else if (this.translate.currentLang == 'fr') {
			tle = "Confirmer"
			msg = 'Voulez vous ajouter ce programme à vos programmes ?';
			yes = "Oui";
			no = "Non";
		}
		else if (this.translate.currentLang == 'de') {
			tle = "Bestätigen"
			msg = 'Möchten Sie dieses Programm zu Ihren Programmen hinzufügen ?';
			yes = "Ja";
			no = "Nein";
		}
		let alert = this.alertCtrl.create({
			title: tle,
			message: msg,
			buttons: [
				{
					text: yes,
					handler: () => {
						this.ngZone.run(() => {
							this.diffuseur1.addToProgDispo(prog);
							this.diffuseur1.removeProg(prog);
						});
					}
				},
				{
					text: no,
					role: 'cancel',
					handler: () => {
					}
				}
			]
		});
		alert.present();
	}


	//Fonction settings
	//Entrée : --
	//Sortie : --
	//Rôle : Permet de charger la page de réglages (modification du nom du diffuseur)
	settings() {
		this.navCtrl.push(SettingsPage, {
			translate: this.translate,
		});
	}

	//Fonction presentAlert
	//Entrée : --
	//Sortie : --
	//Rôle : Permet d'indiquer à l'utilisateur que l'on a pas se connecter au device souhaité
	presentAlert() {
		let alert = this.alertCtrl.create({
			title: 'Erreur',
			subTitle: 'Impossible de se connecter au diffuseur, veuillez réassayer',
			buttons: ['Ok']
		});
		alert.present();
	}

	//Fonction getName
	//Entrée : --
	//Sortie : --
	//Rôle : permet de demander à la RPI le nom du parfum puis de modifier le nom sur l'application
	getName() {
		this.bluetoothSerial.write('getNomParfum');
		this.bluetoothSerial.subscribeRawData().subscribe((data) => {
			this.bluetoothSerial.read().then(data => {
				console.log(data);
				this.diffuseur1.setNomParfum(data);
			});
		});
	}



}
