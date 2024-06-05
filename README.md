Prérequis
Avant d'exécuter le projet, assurez-vous d'avoir les éléments suivants installés :

Node.js (v16.17.1) : Télécharger Node.js
Angular CLI (Angular CLI: 16.0.1) : Exécutez la commande suivante pour installer Angular CLI globalement :


npm install -g @angular/cli
Assurez-vous également d'avoir un accès à une base de données [dbBrowser] :
https://sqlitebrowser.org/

Installation
Suivez les étapes ci-dessous pour installer et exécuter le projet :

Clonez le projet depuis le dépôt GitHub :
https://etulab.univ-amu.fr/n19024814/project_pfe.git

Changer la branche : main to frontend.

Accédez au répertoire du projet :

cd project_pfe

Installez les dépendances du projet :
npm install --force
Au càs où il existe encore des dépendances ou des bibliothèques qui ne sont pas encore installées, il faut les installer séparément : 
Exemple : npm i better-sqlite3.

Utilisation
(supprimer db.sqlite utilisée)
BACKEND : 

Si vous voulez supprimer nos données Configurer la base de donnée:
cd Model => node database.js / node model.js

Sinon directement : 

cd Controller => node index.js
AFFICHAGE : sqlite CONNECTED
[2023-06-04 19:35:23] DEBUG Creating transport: nodemailer (6.9.1; +https://nodemailer.com/; SMTP/6.9.1[client:6.9.1])
Server started

FRONTEND :
cd frontend / ng serve
** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **


√ Compiled successfully.


Enregistrement :
Lorsque vous accédez au site pour la première fois, vous devez vous inscrire en fournissant certaines informations, telles que votre nom, votre adresse e-mail et un mot de passe. Vous pouvez remplir un formulaire d'inscription qui demande ces informations. Une fois que vous avez soumis le formulaire, vos informations d'enregistrement sont enregistrées dans la base de données du site.

Confirmation d'e-mail :
Après votre enregistrement, vous recevrez un e-mail de confirmation à l'adresse e-mail que vous avez fournie lors de l'inscription. Cet e-mail contient un lien de confirmation que vous devez cliquer pour vérifier votre adresse e-mail. En cliquant sur le lien de confirmation, votre adresse e-mail est confirmée et votre compte est activé.

NB : Vous ne pourrez pas vous connecter sans confirmer votre adresse email.

Connexion :
Une fois votre compte activé, vous pouvez vous connecter en utilisant votre adresse e-mail et votre mot de passe. Sur la page de connexion, vous verrez un formulaire où vous devez saisir vos informations d'identification. Après avoir soumis le formulaire, le site vérifiera vos informations et si elles sont correctes, vous serez connecté à votre compte.
Vous serez redirigé vers une page d'acceuil où vous aurez la possibilité de tester les fonctionnalités.


#   1 3 B y A m u  
 