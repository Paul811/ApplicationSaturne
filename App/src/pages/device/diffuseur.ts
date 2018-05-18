//Interface de programme du diffusion
interface prog {
	name: string,
	isEnable: boolean,
	img: string
}

//Déclaration des variables
var zen: prog = {
	name: "Zen",
	isEnable: true,
	img: "img/yinYang.png"
}

var cerveau: prog = {
	name: "Stimulation intellectuelle",
	isEnable: false,
	img: "img/brain.png"
}

var repos: prog = {
	name: "Aide au sommeil",
	isEnable: true,
	img: "img/sleep.png"
}

var test1: prog = {
	name: "Test1",
	isEnable: true,
	img: "img/test1.png"
}

//Classe diffuseur 
//Parametres : 
//	- Nom du parfum
//	- Niveau de parfum
//	- Tableau de programme de diffusion
//	- Nom du diffuseur 
//	- Durée de diffusion
//	- Intensité de diffusion
//	- Tableau des programmes disponibles (choisi par l'utilisateur)
//	- Tableau des autres programmes disponibles (selon le nom du parfum)
//	- Device (bluetooth id, bluetooth name, ...)
export class diffuseur {

	nomParfum: string;
	niveauParfum: any;
	prgDiffusion: prog[];
	nomDiffuseur: string;
	dureeDiffusion: any;
	intensiteDiffusion: any;
	progDispo: any[] = [zen, cerveau];
	autreProgDispo: any[] = [repos, test1];
	device: any;

	//Constructeur 
	constructor(device: any, nomParfum: string, niveauParfum: any, prgDiffusion: prog[], nomDiffuseur: string, dureeDiffusion: any, intensiteDiffusion: any) {
		this.nomParfum = nomParfum;
		this.niveauParfum = niveauParfum;
		this.prgDiffusion = prgDiffusion;
		this.nomDiffuseur = nomDiffuseur;
		this.dureeDiffusion = dureeDiffusion;
		this.intensiteDiffusion = intensiteDiffusion;
		this.device = device;
	}

	//Fonction getNomParfum
	//Entrée : --
	//Sortie : nomParfum
	//Rôle : Permet de retourner le nom du parfum
	getNomParfum() {
		return this.nomParfum;
	}

	//Fonction setNomParfum
	//Entrée : nomParfum
	//Sortie : --
	//Rôle : Permet de modifier le nom du parfum
	setNomParfum(nomParfum: any) {
		this.nomParfum = nomParfum;
		this.updateProgDispo();
	}

	//Fonction getDevice
	//Entrée : --
	//Sortie : device
	//Rôle : Permet de retourner le device
	getDevice() {
		return this.device;
	}

	//Fonction setDureeDiffusion
	//Entrée : dureeDiffusion
	//Sortie : --
	//Rôle : Permet de modifier la durée de diffusion
	setDureeDiffusion(dureeDiffusion: any) {
		this.dureeDiffusion = dureeDiffusion;
	}

	//Fonction getDureeDiffusion
	//Entrée : --
	//Sortie : dureeDiffusion
	//Rôle : Permet de modifier la durée de diffusion
	getDureeDiffusion() {
		return this.dureeDiffusion;
	}

	//Fonction setIntensiteDiffusion
	//Entrée : intensiteDiffusion
	//Sortie : --
	//Rôle : Permet de modifier l'intensité de diffusion
	setIntensiteDiffusion(intensiteDiffusion: any) {
		this.intensiteDiffusion = intensiteDiffusion;
	}

	//Fonction getIntensiteDiffusion
	//Entrée : --
	//Sortie : intensiteDiffusion
	//Rôle : Permet de retourner l'intensité de diffusion
	getIntensiteDiffusion() {
		return this.intensiteDiffusion;
	}

	//Fonction getNomDiffuseur
	//Entrée : --
	//Sortie : nomDiffuseur
	//Rôle : Permet de retourner le nom du diffuseur
	getNomDiffuseur() {
		return this.nomDiffuseur;
	}

	//Fonction setNomDiffuseur
	//Entrée : nomDiffuseur
	//Sortie : --
	//Rôle : Permet de modifier l'intensité de diffusion
	setNomDiffuseur(nomDiffuseur: string) {
		this.nomDiffuseur = nomDiffuseur;
	}

	//Fonction getProgDispo
	//Entrée : --
	//Sortie : progDispo
	//Rôle : Permet de retourner le tableau de programme disponible (choisi par l'utilisateur)
	getProgDispo() {
		return this.progDispo;
	}

	//Fonction addToProgDispo
	//Entrée : prog
	//Sortie : --
	//Rôle : Permet d'ajouter un programme à la liste de programmes disponibles
	addToProgDispo(myProg: prog) {
		this.progDispo.push(myProg);
	}

	//Fonction removeProg
	//Entrée : prog
	//Sortie : --
	//Rôle : Permet de supprimer un programme de la liste des autres programmes disponibles
	removeProg(myProg: prog) {
		let index = this.autreProgDispo.indexOf(myProg);
		if (index > -1) {
			this.autreProgDispo.splice(index, 1);
		}
	}

	//Fonction getAutreProg
	//Entrée : --
	//Sortie : autreProgDispo
	//Rôle : Permet de retourner le tableau des autres programmes disponibles
	getAutreProgDispo() {
		return this.autreProgDispo;
	}

	//Fonction getDeviceId
	//Entrée : --
	//Sortie : device.id
	//Rôle : Permet de retourner l'id du device
	getDeviceId() {
		return this.device.id;
	}

	//Fonction setIsEnable
	//Entrée : nomProg, value
	//Sortie : --
	//Rôle : Permet de modifier si un programme est disponible (selon le parfum) ou non
	setIsEnable(nomProg : prog, value: boolean){
		let index = this.autreProgDispo.indexOf(nomProg);
		if (index > -1){
			let prog = this.autreProgDispo[index];
			prog.isEnable = value;
		}
		index = this.progDispo.indexOf(nomProg);
		if (index > -1){
			let prog = this.progDispo[index];
			prog.isEnable = value;
		}
		
	}

	//Fonction updateProgDispo
	//Entrée : --
	//Sortie : --
	//Rôle : Permet de mettre à joue les programmes disponibles selon le parfum
	updateProgDispo()
	{
		if(this.nomParfum == "Sauvage"){
			console.log("Update : Sauvage");
			this.setIsEnable(test1, false);
			this.setIsEnable(repos, true);
			this.setIsEnable(cerveau, true);
			this.setIsEnable(zen, true);
		}
		else if(this.nomParfum == "Fahrenheit"){
			console.log("Update : Fahrenheit");
			this.setIsEnable(test1, false);
			this.setIsEnable(repos, false);
			this.setIsEnable(cerveau, true);
			this.setIsEnable(zen, false);
		}
		else if(this.nomParfum == "J'adore"){
			console.log("Update : J'adore");
			this.setIsEnable(test1, true);
			this.setIsEnable(repos, true);
			this.setIsEnable(cerveau, true);
			this.setIsEnable(zen, true);
		}
		else if(this.nomParfum == "Coco"){
			console.log("Update : Coco");
			this.setIsEnable(test1, false);
			this.setIsEnable(repos, true);
			this.setIsEnable(cerveau, false);
			this.setIsEnable(zen, true);
		}
		else
		{
			console.log("Update : Aucun parfum");
			this.setIsEnable(zen, false);
			this.setIsEnable(test1, false);
			this.setIsEnable(repos, false);
			this.setIsEnable(cerveau, false);
			
		}
	}


}