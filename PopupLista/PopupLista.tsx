import * as React from 'react';
import { IPopupListaProps } from './IPopupListaProps';
import s from './PopupLista.module.scss';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';

import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/components/Button';


import { Util } from '../../../common/Util';

import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import { util } from 'sp-pnp-js';
import PopupCadastroAditivo from './../PopupCadastroAditivo';
import PopupCadastroHistorico from './../PopupCadastroHistorico';
import PopupCadastroProdutos from './../PopupCadastroProdutos';
import PopupCadastroArquivos from './../PopupCadastroArquivos';

import * as api from './../_api';



export interface IPopupListaState {
    items: any[];
    selectedItem: number;
    showPanel: boolean;
    mostraCadastro: boolean;
}

export default class PopupLista extends React.Component<IPopupListaProps, IPopupListaState> {
    public constructor(props: IPopupListaProps) {
        super(props);
        this.state = {
            items: [],
            selectedItem: 0,
            showPanel: false,
            mostraCadastro: false
        };
    }
    public action = async (): Promise<void> => {
        api.atualizatotais();
        this.setState(() => { return { ...this.state, mostraCadastro: !this.state.mostraCadastro }; });
        let ret = await Util.get(this.props.endpoint + "/contrato/" + api.idContrato);
        await this.setState({ items: ret });
    }

    public async componentWillMount() {
        //debugger;
        if (api.idContrato != null) {
            let items = await Util.get(this.props.endpoint + "/contrato/" + api.idContrato);
            await this.setState({ items: items });
        }

    }
    public limpaSelecao = async (): Promise<void> => {
        let tempItems = this.state.items;
        var i, n = tempItems.length;

        for (i = 0; i < n; ++i) {
            tempItems[i].selecionado = 0;
        }
        this.setState({ items: tempItems });
        this.setState({ selectedItem: 0 });

    }
    private _onSubmitCreate = () => {
        this.setState({ showPanel: true });
    }
    public setSelected = (event): void => {
        let selectedID = event.target.value;
        let tempItems = this.state.items;
        let itemSelected;
        itemSelected = tempItems.filter(x => x[this.props.idName] == selectedID)[0];

        let itemSelectedIndex = tempItems.indexOf(itemSelected, 0);

        var i, n = tempItems.length;

        if (tempItems[itemSelectedIndex].selecionado == 1) {
            for (i = 0; i < n; ++i) {
                tempItems[i].selecionado = 0;
            }
            selectedID = 0;
        } else {
            for (i = 0; i < n; ++i) {
                tempItems[i].selecionado = 0;
            }
            tempItems[itemSelectedIndex].selecionado = 1;
            selectedID = event.target.value;
        }
        this.setState({ items: tempItems });
        this.setState({ selectedItem: selectedID });
    }
    private _onRenderFooterContent = (): JSX.Element => {
        return (
            <div style={{ display: 'inline' }}>
                <PrimaryButton onClick={async () => this.excluiItem()} style={{ marginRight: '8px' }}>
                    Excluir
          </PrimaryButton>
                <DefaultButton onClick={() => this._onClosePanel()}>Cancelar</DefaultButton>
            </div>
        );
    }
    public ComponentedeCriacao = (): JSX.Element => {
        let mostraCadastro = (this.state.mostraCadastro) ? ('block') : ('none');

        switch (this.props.label) {
            case ("Aditivos"):
                return (<PopupCadastroAditivo
                    key={mostraCadastro}
                    action={this.action}
                    inputAlteradoArquivo={this.props.inputAlteradoArquivo}
                    idSelecionado={this.state.selectedItem} />);
            case ("Históricos"):
                return (<PopupCadastroHistorico
                    key={mostraCadastro}
                    action={this.action}
                    inputAlteradoArquivo={this.props.inputAlteradoArquivo}
                    idSelecionado={this.state.selectedItem} />);
            case ("Produtos"):
                return (<PopupCadastroProdutos
                    action={this.action}
                    key={mostraCadastro}
                    inputAlteradoArquivo={this.props.inputAlteradoArquivo}
                    idSelecionado={this.state.selectedItem} />);
            case ("Arquivos"):
                return (<PopupCadastroArquivos
                    action={this.action}
                    key={mostraCadastro}
                    idSelecionado={this.state.selectedItem}
                    inputAlteradoArquivo={this.props.inputAlteradoArquivo} />);
        }
    }
    private async excluiItem(): Promise<void> {
        Util.delete(this.props.endpoint, this.state.selectedItem).then(() => {
            debugger;
            this._onClosePanel();
        });
    }
    private _onClosePanel = () => {
        Util.get(this.props.endpoint).then(ret => {
            this.setState({ showPanel: false, items: ret });
        });
    }
    public render(): React.ReactElement<IPopupListaProps> {
        let { itemsToShow } = this.props;
        let { items } = this.state;
        let mostraCadastro = (this.state.mostraCadastro) ? ('block') : ('none');
        return (<>
            <div style={{ padding: '0px', display: mostraCadastro, position: 'absolute', height: "100%", zIndex: 1, width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', right: '0px', marginTop: '-35px' }}>
                {this.ComponentedeCriacao()}
            </div>
            <div className={s.popup}>
                <div style={{ display: api.bloqueiaedicao ? 'none' : 'block' }} className="col-md-3">
                    <button type="button" onClick={async () => { await this.limpaSelecao(); this.action(); }} className={s.CustomButtonAdicionar}>Novo</button>
                </div>
                <div className="col-md-3">
                    <button type="button" onClick={() => this.action()} className={s.CustomButtonEditar}>Editar</button>
                </div>
                <div style={{ display: api.bloqueiaedicao ? 'none' : 'block' }} className="col-md-3">
                    <button type="button" onClick={() => this._onSubmitCreate()} className={s.CustomButtonRemover}>Excluir</button>
                </div>
                <div className="col-md-3">
                    <button type="button" className={s.botaoFechar} onClick={() => { this.limpaSelecao(); this.props.action(this.props.actionParameter); }}>Fechar</button>
                </div>
                <div className="col-md-12" style={{ backgroundColor: 'white', marginBottom: '15px' }}>
                    <ReactTable
                        data={items}
                        filterable
                        showPagination={false}
                        defaultPageSize={20}
                        columns={[
                            {
                                Filter: () => { return (null); },
                                id: "checkbox",
                                accessor: "",
                                Cell: ({ original }) => {
                                    return (
                                        <input
                                            type="radio"
                                            className="radio"
                                            checked={original.selecionado ? true : false}
                                            name="radioContrato"
                                            value={original[this.props.idName]}
                                            onChange={(event) => this.setSelected(event)}
                                        />
                                    );
                                },
                                Header: x => {

                                },
                                sortable: false,
                                width: 45
                            }
                        ].concat(itemsToShow)}
                        style={{
                            height: "500px",  // This will force the table body to overflow and scroll, since there is not enough room
                            fontSize: "smaller",
                        }}
                        className="-striped -highlight"
                    />
                </div>
            </div>
            <Panel isOpen={this.state.showPanel}
                type={PanelType.smallFixedFar}
                onDismiss={this._onClosePanel}
                isFooterAtBottom={false}
                headerText="Confirme a exclusão do registro."

                closeButtonAriaLabel="Fechar"
                onRenderFooterContent={this._onRenderFooterContent}>
                <span>Por favor, confirme a exclusão do registro.</span>
            </Panel>
        </>);
    }
}