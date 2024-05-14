# Automechanic_App
´´´ts
videoStream?:Blob;
  url:string = "";
  ngOnInit(){
    this.http.get("https://localhost:7247/Video/Stream", {observe: "events", responseType: "arraybuffer", reportProgress: true})
    .subscribe({next: (Event: HttpEvent<ArrayBuffer>)=>{
      if(Event.type == HttpEventType.Response){
        this.videoStream = new Blob([Event.body!], {type:"video/mp4"});
        this.url = URL.createObjectURL(this.videoStream!);
      }
    }});
  }
´´´