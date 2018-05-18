import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

/**
 * Generated class for the SettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})

//Classe SettingsPage permettant de modifier le nom du diffuseur 
export class SettingsPage {
  translate : any;
  device: any;
  name: string;
  todo = {
    title: '',
    description: ''
  };

  //Constructeur de la classe SettingsPage
  //NavController : classe permettant de naviguer entre les pages 
	//NavParams : classe permettant de d'envoyer ou de récuperer des parametres  
	//BluetoothSerial : plugin permettant de gérer la connection bluetooth
  constructor(public navCtrl: NavController, public navParams: NavParams, public bluetoothSerial: BluetoothSerial) {
    //On récupère le device que l'on a choisi
    this.device = this.navParams.get('device');
    //On récupère la langue choisie
		this.translate = this.navParams.get('translate');
  }

  //Fonction validate
  //Entrée : --
  //Sortie : --
  //Rôle : permet de décharger la page et d'envoyer le nouveau nom de diffuseur
  validate() {
    console.log(this.todo.title);
    this.navCtrl.getPrevious().data.newTitle = this.todo.title;
    this.navCtrl.pop();
  }

  //Fonction : ionViewWillLeave
  //Entrée : --
  //Sortie : --
  //Permet de modifier le nom du diffuseur dans la RPI
  ionViewWillLeave() {
    this.bluetoothSerial.write("setNameDiffuseur " + this.todo.title);
  }

}
