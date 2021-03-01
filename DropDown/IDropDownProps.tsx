export interface IDropDownProps {
  idName:string;
  descField:string;
  endpoint:string;
  selectedItem:any;
  label:string;
  handleInput:(event,string) => void;
}