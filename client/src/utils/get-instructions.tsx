export const getInstructions = (type: string) => {
  switch (type) {
    case 'user-list':
      return (
        <>
          Notre liste d'utilisateurs sera ici. : <br />
          <ul>
          <li>
            Créer le composant <code>UserList</code>
          </li>
          <li>
            Au chargement de la page, fetch sur <code>DrawSocket.get('users/get')</code> pour récupérer la liste des users
          </li>
          <li>
            Stocker le résultat dans un store <code>useUsersStore</code> (similaire à <code>useMyUserStore</code>)
          </li>
          <li>
            Puis écouter l'évènement qui met à jour la liste des users renvoyé par le serveur
          </li>
          <li>
            Stocker le nouveau résultat dans le store associé
          </li>
          <li>
            Afficher la liste des users en utilisant l'UI <a href="https://daisyui.com/components/list/" target="_blank" rel="noopener noreferrer"><code>.list</code></a>
          </li>
          </ul>
        </>
      )

    case 'draw-area':
      return (
        <>
          Notre zone de dessin sera ici. : <br />
          <ul>
          <li>
            Créer le composant <code>DrawArea</code>
          </li>
          <li>
            Utiliser un élément HTML5 <code>&lt;canvas&gt;</code> pour la zone de dessin
          </li>
          <li>
            Au chargement de la page, fetch sur <code>DrawSocket.get('/strokes/get')</code> pour récupérer la liste des traits de dessin existants
          </li>
          <li>
            Gérer les événements de la souris pour dessiner sur le canvas
          </li>
          
          <li>
            Envoyer les données de dessin au serveur via <code>DrawSocket.emit('draw:data', ...)</code>
          </li>
          <li>
            Écouter les données de dessin des autres utilisateurs via <code>DrawSocket.listen('draw:data', ...)</code> et mettre à jour le canvas en conséquence
          </li>
          </ul>
        </>
      );
    case 'toolbar':
      return (
        <>
          Notre barre d'outils sera potentiellement ici : <br />
          <ul>
          <li>
            Créer le composant <code>Toolbar</code>
          </li>
          <li>
            Ajouter des boutons pour sélectionner les outils de dessin (pinceau, gomme, etc.)
          </li>
          <li>
            Ajouter des options pour changer la couleur et la taille du pinceau
          </li>
          <li>
            Gérer l'état des outils sélectionnés dans un store ou via le state local du composant
          </li>
          </ul>
        </>
      );
    default:
      return <></>
  }
}