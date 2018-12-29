import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api";

const resource = 'garment-unit-receipt-notes/unit-delivery-order';

module.exports = function(keyword, filter) {

    var config = Container.instance.get(Config);
    var endpoint = config.getEndpoint("purchasing-azure");

    return endpoint.find(resource, { keyword: keyword, filter: JSON.stringify(filter) })
        .then(results => {
            return results.data.map(unitReceiptNote => {
                unitReceiptNote.Items.map(k => {
                        k.toString = function () {
                            return `${this.RONo}`;
                        }
                    return k;
                    });
            });
        });
}
