import * as React from 'react';
import { IDropDownProps } from './IDropDownProps';
import { Util } from '../../../common/Util';


export interface IDropDownState {
    items: any[];
}

export default class DropDown extends React.Component<IDropDownProps, IDropDownState> {
    public constructor(props: IDropDownProps) {
        super(props);
        this.state = {
            items: []
        };
    }
    public async componentWillMount() {
        let items = await Util.get(this.props.endpoint);

        await this.setState({ items: items });
    }
    public render(): React.ReactElement<IDropDownProps> {
        let { idName, descField, label, selectedItem } = this.props;
        let { items } = this.state;
        let itemsRender = items.map((item) => {
            return (<option key={item.id}
                value={item[idName]} >{item[descField]}</option>);
        });
        return (<>
            <div className="col-md-4">
                <label >{label} </label>
                <select value={selectedItem ? selectedItem : 0}
                    className="form-control form-control-sm" style={{ width: '100%' }}
                    onChange={(event) => this.props.handleInput(event.target.value, idName)}>
                    <option key={0} disabled value={0}  > -- Selecione uma opção -- </option>
                    {itemsRender}
                </select>
            </div>
        </>);
    }
}