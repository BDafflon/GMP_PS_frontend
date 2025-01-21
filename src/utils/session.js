export class Session {
    constructor() {
      this.phase=-1
      this.listDetail = [];
    }
    
  }
  
  export class SessionDetail{

    constructor() {
      this.groupe="STI"
      this.nbDossier=0
      this.lectureOuverte=false
      this.motifAcception=Motif.Rien
      this.motifRefus=Motif.Motif
    }

  }

  export const Motif={
    Rien:0,
    Note:1,
    Motif:2
  }

 