export interface IPopupListaProps{
  action: (event) => void;
  actionParameter: string;
  inputAlteradoArquivo: (event) => Array<any>;
  idContrato:string;
  idName:string;
  endpoint:string;
  itemsToShow:any[];
  label:string;
}