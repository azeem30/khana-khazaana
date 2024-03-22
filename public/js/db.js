db.enablePersistence()
    .catch(error => {
        if(error.code === 'failed-precondition'){
            console.log("Persistence failed");
        }
        else if(error.code === 'unimplemented'){
            console.log("Persistence not available!");
        }
    });

db.collection('recipes').onSnapshot((snapshot) => {
    //console.log(snapshot.docChanges());
    snapshot.docChanges().forEach(change => {
        if(change.type === 'added'){
            renderRecipe(change.doc.id, change.doc.data());
        }
        if(change.type === 'removed'){
            removeRecipe(change.doc.id);
        }
    });
});

const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const recipe = {
        title: form.title.value,
        ingredients: form.ingredients.value
    };
    db.collection('recipes').add(recipe)
        .catch(error => {
            console.log(error);
        });
    form.title.value = '';
    form.ingredients.value = '';
});

const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click', (event) => {
    //console.log(event);
    if(event.target.tagName === 'I'){
        const id = event.target.getAttribute('data-id');
        db.collection('recipes').doc(id).delete();
    }
});