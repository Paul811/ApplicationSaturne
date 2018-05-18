import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

/**
 * Generated class for the ZenPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-zen',
  templateUrl: 'zen.html',
})

//Classe ZenPage permettant de play ou pause le programme
export class ZenPage {

  device: any;
  translate: any;
  isPlayEnable: boolean;
  isPauseEnable: boolean;

  //Constructeur de la classe ZenPage
	//ToastController : classe permettant d'afficher des messages d'une certaine durée à l'écran
  //NavController : classe permettant de naviguer entre les pages 
  //NavParams : classe permettant de d'envoyer ou de récuperer des parametres  
	//BluetoothSerial : plugin permettant de gérer la connection bluetooth
  constructor(public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams, public bluetoothSerial: BluetoothSerial) {
    //On récupère le device et la langue choisie
    this.device = this.navParams.get('device');
    this.translate = this.navParams.get('translate');
  }

  //Fonction ionViewWillEnter
  //Entrée : --
  //Sortie : --
  //Rôle : permet de récupérer l'état de la diffusion (play ou pause)
  ionViewWillEnter() {
    this.isPauseEnable = this.navParams.get('pauseZen');
    this.isPlayEnable = this.navParams.get('playZen');
  }

  //Fonction popView
  //Entrée : --
  //Sortie : --
  //Rôle : permet d'envoyer l'état de diffusion (play ou pause) et de décharger la page
  popView() {
    this.navCtrl.getPrevious().data.pauseZen = this.isPauseEnable;
    this.navCtrl.pop();
  }

  //Fonction play
  //Entrée : --
  //Sortie : --
  //Rôle : permet de lancer la diffusion
  play() {
    console.log("PlayZen");
    this.bluetoothSerial.write('PlayZen');
    this.isPlayEnable = false;
    this.isPauseEnable = true;
  }

  //Fonction play
  //Entrée : --
  //Sortie : --
  //Rôle : permet de stopper la diffusion
  pause() {
    console.log("PauseZen");
    this.bluetoothSerial.write('PauseZen');
    this.isPauseEnable = false;
    this.isPlayEnable = true;
    this.bluetoothSerial.write('getStateCapsule');
    this.bluetoothSerial.subscribeRawData().subscribe((data) => {
      this.bluetoothSerial.read().then(data => {
        console.log(data);
        this.stateCapsuleAlert(data);
      });
    });
  }

  //Fonction stateCapsuleAlert
  //Entrée : data
  //Sortie : --
  //Rôle : permet d'informer l'utilisateur de l'état de la capsule 
  stateCapsuleAlert(data) {
    let value = Number(data);
    let msg = "";
    if (value == 5000) {
      if (this.translate.currentLang == 'en') {
        msg = 'The capsule was totally consumed';
      }
      if (this.translate.currentLang == 'fr') {
        msg = 'La capsule a été totalement utilisé';
      }
      if (this.translate.currentLang == 'de') {
        msg = 'Die Kapsel war total verbraucht';
      }
    }
    else {
      let valueP = (value * 100) / 5000;
      if (this.translate.currentLang == 'en') {
        msg = ('Capsule used at ' + valueP + '%');
      }
      if (this.translate.currentLang == 'fr') {
        msg = ('Capsule utilisée à ' + valueP + '%');
      }
      if (this.translate.currentLang == 'de') {
        msg = ('Kapsel bei ' + valueP + '% benutzt');
      }
    }

    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'middle'
    });
    toast.present();
  }

}
