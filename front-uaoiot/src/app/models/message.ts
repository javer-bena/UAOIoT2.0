export class Message{
    constructor(
        public id:string,
        public topic:string,
        public user:string,
        public payload:string,
        public cliendId:string,
        public qos:string,
        public date:string
    ){}
}