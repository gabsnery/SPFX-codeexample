

import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';





class TelaAdicionaEditaContrato extends React.Component<{}, {}>{
  
  public state = {
  };

  public getPeoplePickerItems = async (items: any[]) => {//------Inicio getPeoplePickerItems------------

    var vart = [];
    var item = {};
    item["id"] = items[0].id;
    item["useremail"] = items[0].secondaryText.toString();
    vart.push(item);

    this.setState({ gestor: vart });
  }//---------------------------------------------Fim getPeoplePickerItems------------



  public handleShow = (event, popup?): void => {
    let displayTeste = this.state.listaDisplay;
    displayTeste[event] = displayTeste[event] == true ? false : true;
    this.setState({ listaDisplay: displayTeste });
  }

  public render(): React.ReactElement<ISpaFeedWebpartProps> {

    return (
      <>
        <div ref={(topElement) => this._topElement = topElement!} />
        <div className={styles.Add} /*style={{ display: telacarregada }} */ id="idtop">
          <div style={{ padding: '0px', display: this.state.listaDisplay["changePopUpListaProdutos"] ? "block" : "none", position: 'absolute', height: "100%", zIndex: 1, width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', right: '0px', marginTop: '-35px' }}>
            <PopupLista
              key={api.listasKey}
              action={this.handleShow}
              actionParameter="changePopUpListaProdutos"
              inputAlteradoArquivo={this.inputAlteradoArquivo}
              idContrato={this.state.Contrato["idcontrato"]}
              idName={"idtbprodutos"}
              label="Produtos"
              endpoint={"/Produto"}
              itemsToShow={[{
                Header: "Título",
                accessor: "titulo",
                width: 100,
              },
              {
                Header: "Descrição",
                accessor: "descricaotbprodutos",
                width: 500,
              },
              {
                Header: "Data inicial",
                id: "datainicial",
                accessor: "datainicial",
                Cell: c => <span>{c.original.datainicial && moment(c.original.datainicial).format("DD/MM/YYYY")}</span>,
                width: 100,
              },
              {
                Header: "Data final",
                id: "datafinal",
                accessor: "datafinal",
                Cell: c => <span>{c.original.datafinal && moment(c.original.datafinal).format("DD/MM/YYYY")}</span>,
                width: 100,
              }]}
            />

          </div>

          <div className="col-md-9" style={{ backgroundColor: 'white' }}>
            <div className="col-md-12" style={{ marginTop: '10px', marginBottom: '10px' }}>
              <label style={{ color: 'red', }}>{carregando}</label>
            </div>
            <fieldset disabled={api.bloqueiaedicao}>
              <div className="col-md-12" style={{ marginTop: '10px' }}>
                <DropDown
                  idName="idtbsituacao"
                  descField="descricaotbsituacao"
                  endpoint="/situacao"
                  selectedItem={this.state.Contrato["idtbsituacao"]}
                  label="Situação"
                  handleInput={this.inputAlterado} />
              </div>
                <div className="col-md-6">
                  <label >Gestor do Contrato</label>
                  <PeoplePicker context={this.props.context}
                    titleText=""
                    personSelectionLimit={1}
                    groupName={""}
                    showtooltip={false}
                    isRequired={false}
                    disabled={false}
                    ensureUser={true}
                    selectedItems={this.getPeoplePickerItems}
                    defaultSelectedUsers={[this.state.gestor[0] ? this.state.gestor[0].useremail : ""]}
                    showHiddenInUI={false}
                    principalTypes={[PrincipalType.User]}
                    resolveDelay={1000}
                  />
                </div>
        </div>
      </>
   </div>

    );

  }
}

export default TelaAdicionaEditaContrato;
