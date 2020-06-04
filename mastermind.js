'use strict'
$(document).ready(function() {
   
/** Partie 1 - options de couleurs **/
    //Q1    
    $(".optionCouleur").each(function() {
            $(this).css("background-color",$(this).attr("data-col"));
    })    
    
    //Q2
    function couleurAuHasard(){
        var options=$(".optionCouleur")
        var i=Math.floor(Math.random() * options.length)
        return $(options[i]).attr("data-col");
        //autre possibilité: $(".optionCouleur").eq(i).attr("data-col");
    }    

/** Partie 2 - sélection **/
    //Q1
    function select(element) {
        $(".combinaison.select").removeClass("select");
        element.addClass("select") ;                  
    }
    
    //Q2
    $("#jeu .combinaison").click(function() {
        select($(this));
    }) 
    
    //Q3
    $(".optionCouleur").click(function() {
        var couleur=$(this).attr("data-col");
        $(".combinaison.select").attr("data-col", couleur);
        $(".combinaison.select").css("background-color", couleur);        
        droite();
    })
    
    //Q4
    function complet() {
        return $('#jeu .combinaison[data-col="none"]').length === 0;
    }
    
    
/** Partie 3 - combinaisons et indices **/    
        
    //Q1
    function combinaisonAuHasard() {
        var combinaison=[]
        $("#jeu .combinaison").each(function(){
            combinaison.push(couleurAuHasard());
        })
        return combinaison;                
    }
    
    //Q2
    var solution = combinaisonAuHasard();    
    var tailleCombinaison = $("#jeu .combinaison").length;
    console.log(solution);
    
    //Q3
    function combinaisonSaisie(){
        var combinaison=[]
        $("#jeu .combinaison").each(function(){
            combinaison.push( $(this).attr("data-col"));            
        })
        return combinaison;                
    }
    
    //Q4
    function ajouteIndice(classe) {
          $("#jeu .indices").append('<div class="'+classe+'"></div>');
    }
    
    
/** Partie 4 - clavier **/    
    
    //Q1
    function droite(){
        var suivant=$("#jeu .combinaison.select").next();
        if (suivant.length==0)
            suivant=$("#jeu .combinaison").first();
        $(".combinaison.select").removeClass("select");
        select(suivant);  
    }
    //Q2
    function gauche(){
        var suivant=$("#jeu .combinaison.select").prev();
        if (suivant.length==0)
            suivant=$("#jeu .combinaison").last();
        select(suivant);
    }    
    
    //Q3
    function choix(i) {
        var couleur=$(".optionCouleur").eq(i).attr("data-col");
        $(".combinaison.select").attr("data-col", couleur);
        $(".combinaison.select").css("background-color", couleur);   
        droite();
    }
    //Q4
    $(document).keydown(function(e){
            if (e.key=="ArrowRight")
                droite();
            if (e.key=="ArrowLeft")
                gauche();    
            var num=e.keyCode-48;
            if (num>=1 && num<=8)
                choix(num-1);      
            if (e.key=="Enter")  //Partie 5 
                valider();    
            
    })
    
    
    
/** Partie 5 - combinaison suivante **/
     //Q1
    function historique() {
        var copie= $("#jeu").clone();
        copie.attr("id", null);
        copie.find(".select").removeClass("select");
        $("#historique").prepend(copie);
        
    }
    
    //Q2
    function nettoyer() {
            $("#jeu .combinaison").attr("data-col","none");
            $("#jeu .combinaison").css("background-color","grey");
            $("#jeu .indices>*").remove();
            select($("#jeu .combinaison").first());
    }
    
    //Q3
    
    var nombreCoups = 0;
   
    function valider() {
        if (!complet()) return; 
        nombreCoups=nombreCoups+1;
            $("#nombreCoups").text(nombreCoups); 
                
        var sol =solution.slice();
        var jeu = combinaisonSaisie();
        if (gagne(sol, jeu)) {  //Partie 6
            $("#message").css('display', 'flex'); //Partie 6
        }
        pionsNoirs(sol,jeu); //Partie 6
        pionsBlancs(sol,jeu); //Partie 6
        
        historique(); 
        nettoyer();
   }
   $("#valider").click(valider);
    
   
   
/* Partie 6 - comparaison des solutions  */


    //Q1
    function gagne(sol, jeu){
        for (var i=0; i<tailleCombinaison; i++) {
            if (sol[i]!=jeu[i]) {
                return false;
            }
        }      
        return true;
    }
    
    //Q2
    function pionsNoirs(sol, jeu) {     
        for (var i=0; i<tailleCombinaison; i++) {
            if (sol[i]==jeu[i]) {
                sol[i]=-1;
                jeu[i]=-2;
                ajouteIndice("bien");
            }
        }     
    }
    
   
    //Q3
    function pionsBlancs(sol, jeu) {        
        for (var i=0; i<tailleCombinaison; i++) {
            for (var j=0; j<tailleCombinaison; j++) {
                if (sol[i]==jeu[j]) {
                    sol[i]=-1;
                    jeu[j]=-2;
                    ajouteIndice("mal");                    
                }
            }
        }
    }
        
    //Q4  -- cf.  valider()  
   
    
    /* Partie 7 - Rejouer et changer la difficulté  */

    $("#rejouer").click(function () {
        $(".combinaison").attr("data-col", "none");
        $(".combinaison").attr("style", "");
        $("#historique").empty();
        $("#message").css('display', 'none');  
        solution = combinaisonAuHasard();
        console.log(solution);    
        tailleCombinaison = $("#jeu .combinaison").length;
        nombreCoups=0;
    });

    $("#plusDur").click(function() {
        var difficulty = $("#jeu > .choixCombinaison > .combinaison");
        if (difficulty.length < 9) 
            $("#jeu > .choixCombinaison").append('<div class="combinaison" data-col="none"></div>');
        return false;
    });
    $("#plusFacile").click(function() {
        // rajouter minimum 1
        var difficulty = $("#jeu > .choixCombinaison > .combinaison");
        if (difficulty.length > 1) 
            difficulty.last().remove();
        return false;
    });
})
