import { RenderListDataOptions } from "sp-pnp-js";

import { urlbase } from '../spaFeedWebpart/components/_funcoes-inclusao';
//import { urlbase } from '.././_funcoes-inclusao';

export class Util {
    public static async get(endpoint): Promise<any> {
        let items = [];
        let url = urlbase + "/api" + endpoint;
        items = await fetch(url)
            .then(response => {
                return response.json();
            }).then(data => {
                return data;
            });
        return items;
    }
    public static async put(endpoint, content): Promise<any> {
        const data_: string = JSON.stringify(content);
        let url = urlbase + "/api" + endpoint;
        let ret = await fetch(url, {
            method: 'put',
            body: data_
        }).then(response => {
            try {
                return response.json();
            } catch (ex) {
                return null;
            }
        }).then((data) => {
            return data;
        });
        return ret;
    }
    public static async delete(endpoint, item): Promise<any> {
        let url = urlbase + "/api" + endpoint + "/" + item;
        fetch(url, {
            method: 'delete'
        }).then(response => {
            return response.json();
        });
    }
    public static convertParaDataOuVazio(data): any { //Utilizado para datas em campos de cadastro
        let ret = data ? new Date(data) : "";
        return ret;
    }
    public static convertDataBancoParaVisual = (data): String => { // Utilizado para datas em listagens
        data = data ? (data).toLocaleString() : '00000000';
        let dia = data.substr(8, 2);
        let mes = data.substr(5, 2);
        let ano = data.substr(0, 4);
        return dia + "/" + mes + "/" + ano;
    }
    public static convertValorMonetario(valor): any { //converte valor monetario para padrão brasileiro
        return ((valor.toString().split(".").join("")).replace(",", "."));
    }
}
