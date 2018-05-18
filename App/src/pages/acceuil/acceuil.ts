import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the AcceuilPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-acceuil',
  templateUrl: 'acceuil.html',
})

//Classe AcceuilPage
//Classe permettant de sauvegarder la langue choisie par l'utilisateur 
//et de rediriger vers la page HomePage (connection bluetooth)
export class AcceuilPage {

  //Constructeur 
  //TranslatService : classe permettant une application multi-langues
  //NavController : classe permettant de naviguer entre les pages
  //NavParams : classe permettant de d'envoyer ou de récuperer des parametres  
  constructor(private translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {
  }

  //Fonction changeLanguage
  //Entrée : langue choisie
  //Sortie : --
  //Rôle : Permet de modifier la langue choisie lorsque l'utilisateur appuie sur le bouton de choix de langue
  public changeLanguage(language) {
    this.translate.use(language);
  }

  //Fonction ionViewDidLoad (fonction chargé OBLIGATOIREMENT lorsque la page a été chargé)
  //Entrée : --
  //Sortie : --
  //Rôle : Afficher que la page a été bien chargé
  ionViewDidLoad() {
    console.log('ionViewDidLoad AcceuilPage');
  }

  //Fonction pushHome
  //Entrée : --
  //Sortie : --
  //Rôle : Permet de charger la page de connection bluetooth en d'envoyer la langue choisie en paramètre
  pushHome() {
    this.navCtrl.push(HomePage, {
      translate: this.translate
    });

  }

}
