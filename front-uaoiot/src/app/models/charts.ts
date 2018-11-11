export class Chart{
    constructor(
    public project:String,
    public user:String,
    public type:String,
    public datas:[any],
    public labels:[any],
    public title:String
    ){}
}