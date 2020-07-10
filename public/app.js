const botones = document.querySelector("#botones");
const nombreUsuario = document.querySelector("#nombreUsuario");
const contenidoProtegido = document.querySelector("#contenidoProtegido");
const formId = document.querySelector("#formId");
const inputChat = document.querySelector("#inputChat");

firebase.auth().onAuthStateChanged(user => {
    if (user) {

      botones.innerHTML = /*html*/ `
      <button class="btn btn-outline-danger" id="btnCerrarSesion">Cerrar Sesión</button> 
      `;
      nombreUsuario.innerHTML = user.displayName;  
      formId.classList='container input-group py-3 px-3 fixed-bottom';
      cerrarSesion();
      contenidoChat(user);
    } else {
      console.log("No existe usuario");
      botones.innerHTML = /*html*/ `
        <button class="btn btn-outline-success mr-2" id="btnAcceder">Acceder</button>
      `;
      contenidoProtegido.innerHTML = /*html*/ `
      <p class="text-center lead mt-5">Deber iniciar sesión</p>
      `;
      nombreUsuario.innerHTML = 'Chat'; 
      formId.classList='container input-group py-3 px-3 fixed-bottom d-none';
      iniciarSesion();
       
    }
  });
  

  const iniciarSesion = () =>{
      const btnAcceder = document.querySelector("#btnAcceder");
      btnAcceder.addEventListener("click", async()=>{
            try{
                const provider = new firebase.auth.GoogleAuthProvider();
                await firebase.auth().signInWithPopup(provider);
            }catch(error){
                console.log(error);
            }
      });
  }

  const cerrarSesion = () =>{
    const btnCerrarSesion = document.querySelector("#btnCerrarSesion");
    btnCerrarSesion.addEventListener("click", () => {
        firebase.auth().signOut();
    });
  }

const contenidoChat = (user) =>{
    // contenidoProtegido.innerHTML = /*html*/ `
    //   <p class="text-center lead mt-5">Bienvenido ${user.email}</p>
    //   `;
      formId.addEventListener("submit", (e) =>{
            e.preventDefault();
            if(!inputChat.value.trim()){
                console.log('input vacio');
                return
            }
            //Agregar elementos
            firebase.firestore().collection('chat').add({
                texto: inputChat.value,
                uid: user.uid,
                fecha: Date.now()
            })
            .then(res => {
                console.log("Mensaje guardado");
            })
            .catch(e => console.log(e))

            inputChat.value = '';
      });

      firebase.firestore().collection('chat').orderBy('fecha')
          .onSnapshot(query =>{
            // console.log(query)
            contenidoProtegido.innerHTML = '';
            query.forEach(doc =>{
              console.log(doc.data());
              if(doc.data().uid === user.uid ){
                contenidoProtegido.innerHTML += /*html */ `
                <div class="d-flex justify-content-end">
                  <span class="badge badge-pill badge-primary">${doc.data().texto}</span>
                </div>
                  `;
              }else{
                contenidoProtegido.innerHTML += /*html */ `
                <div class="d-flex justify-content-start">
                  <span class="badge badge-pill badge-secondary">${doc.data().texto}</span>
                </div>
                `;
              }
              contenidoProtegido.scrollTop = contenidoProtegido.scrollHeight;
            })
      });
}