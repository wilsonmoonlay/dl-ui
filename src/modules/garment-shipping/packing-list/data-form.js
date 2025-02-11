import { inject, bindable, containerless, computedFrom, BindingEngine } from 'aurelia-framework'
import { AuthService } from 'aurelia-authentication';
import { Service, CoreService } from "./service";

var SectionLoader = require('../../../loader/garment-sections-loader');
var BuyerLoader = require('../../../loader/garment-buyers-loader');
var LCLoader = require('../../../loader/garment-shipping-letter-of-credit');

@inject(Service, AuthService, CoreService)
export class DataForm {

    @bindable readOnly = false;
    @bindable title;
    @bindable selectedSection;
    @bindable selectedBuyer;
    @bindable selectedLC;
    @bindable selectedInvoiceType;

    constructor(service, authService, coreService) {
        this.service = service;
        this.authService = authService;
        this.coreService = coreService;
    }

    formOptions = {
        cancelText: "Back"
    }

    activeTab = 0;
    changeRole(tab) {
        this.activeTab = tab;
        // if (tab != 2) {
        //     this.context.saveCallback=null;
        //     this.context.cancelCallback=null;
        //     this.context.deleteCallback=null;
        //     this.context.editCallback=null;
        // }
        // else{
        //     this.context.saveCallback=this.save;
        //     this.context.cancelCallback=this.cancel;
        //     this.context.deleteCallback=this.delete;
        //     this.context.editCallback=this.edit;
        // }
    }

    controlOptions = {
        label: {
            length: 3
        },
        control: {
            length: 5
        }
    };

    footerOptions = {
        label: {
            length: 3
        },
        control: {
            length: 2
        }
    };

    itemsColumns = [
        { header: "RO No" },
        { header: "SC No" },
        { header: "Buyer Brand" },
        { header: "Komoditi" },
        { header: "Komoditi Description" },
        { header: "Qty" },
        { header: "Satuan" },
        { header: "Price RO" },
        { header: "Price" },
        { header: "Mata Uang" },
        { header: "Amount" },
        { header: "Unit" },
        { header: "" },
    ]

    measureColumns = [
        { header: "No", value: "MeasurementIndex" },
        { header: "Length" },
        { header: "Width" },
        { header: "Height" },
        { header: "Qty Cartons" },
        { header: "CBM" },
    ]

    PackingTypeOptions = ["EXPORT", "RE EXPORT"];
    InvoiceTypeOptions = ["DL", "DS", "SM"];
    InvoiceTypeOptionsR = ["DLR", "SMR"];
    PaymentTermOptions = ["LC", "TT/OA"];

    countries =
        ["", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cruise Ship", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyz Republic", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre and Miquelon", "Samoa", "San Marino", "Satellite", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "St Kitts and Nevis", "St Lucia", "St Vincent", "St. Lucia", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];

    get say() {
        var number = this.data.totalCartons;

        const first = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
        const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        const mad = ['', 'thousand', 'million', 'billion', 'trillion'];
        let word = '';

        for (let i = 0; i < mad.length; i++) {
            let tempNumber = number % (100 * Math.pow(1000, i));
            if (Math.floor(tempNumber / Math.pow(1000, i)) !== 0) {
                if (Math.floor(tempNumber / Math.pow(1000, i)) < 20) {
                    word = first[Math.floor(tempNumber / Math.pow(1000, i))] + mad[i] + ' ' + word;
                } else {
                    word = tens[Math.floor(tempNumber / (10 * Math.pow(1000, i)))] + '-' + first[Math.floor(tempNumber / Math.pow(1000, i)) % 10] + mad[i] + ' ' + word;
                }
            }

            tempNumber = number % (Math.pow(1000, i + 1));
            if (Math.floor(tempNumber / (100 * Math.pow(1000, i))) !== 0)
                word = first[Math.floor(tempNumber / (100 * Math.pow(1000, i)))] + 'hundred ' + word;
        }
        return word.toUpperCase();
    }

    get sectionLoader() {
        return SectionLoader;
    }
    sectionView = (section) => {
        var sectionCode = section.Code || section.code;
        var sectionName = section.Name || section.name;
        return `${sectionCode} - ${sectionName}`
    }

    get buyerLoader() {
        return BuyerLoader;
    }
    buyerView = (buyer) => {
        var buyerName = buyer.Name || buyer.name;
        var buyerCode = buyer.Code || buyer.code;
        return `${buyerCode} - ${buyerName}`
    }

    get lcLoader() {
        return LCLoader;
    }

    async bind(context) {
        this.context = context;
        this.data = context.data;
        this.error = context.error;
        this.save = this.context.saveCallback;
        this.cancel = this.context.cancelCallback;
        this.delete = this.context.deleteCallback;
        this.edit = this.context.editCallback;
        this.Items = this.data.items;
        this.Options = {
            isCreate: this.context.isCreate,
            isView: this.context.isView,
            isEdit: this.context.isEdit,
            checkedAll: this.context.isCreate == true ? false : true,
            header: this.data
        }
        if (this.data) {
            this.selectedBuyer = this.data.buyerAgent;
            this.selectedLC = {
                documentCreditNo: this.data.lcNo
            };
        }
        // if(this.activeTab!=2){
        //     this.context.saveCallback=null;
        //     this.context.cancelCallback=null;
        //     this.context.deleteCallback=null;
        //     this.context.editCallback=null;
        // }
        // else{
        //     this.context.saveCallback=this.save;
        //     this.context.cancelCallback=this.cancel;
        //     this.context.deleteCallback=this.delete;
        //     this.context.editCallback=this.edit;
        // }
        this.data.items = this.Items;
        if (this.data.items && this.data.id) {
            for (var item of this.data.items) {
                item.BuyerCodeFilter = this.data.buyerAgent.code;
                item.SectionFilter = this.data.section.code;
            }
        }

        this.data.sayUnit = this.data.sayUnit || "CARTON";

        this.shippingMarkImageSrc = this.data.shippingMarkImageFile || this.noImage;
        this.sideMarkImageSrc = this.data.sideMarkImageFile || this.noImage;
        this.remarkImageSrc = this.data.remarkImageFile || this.noImage;

        let username = null;
        if (this.authService.authenticated) {
            const me = this.authService.getTokenPayload();
            username = me.username;
        }
        var shippingStaff = await this.coreService.getStaffIdByName({size: 1, filter: JSON.stringify({ Name: username })});
        this.data.shippingStaffName = shippingStaff.data[0].Name;
        this.data.shippingStaff = {
          id : shippingStaff.data[0].Id,
          name : shippingStaff.data[0].Name
        };

    }

    get addMeasurements() {
        return (event) => {
            this.data.measurements.push({});
            this.data.measurements.forEach((m, i) => m.MeasurementIndex = i);
        };
    }

    get removeMeasurements() {
        return (event) => {
            this.error = null;
            this.data.measurements.forEach((m, i) => m.MeasurementIndex = i);
            //this.Options.error = null;
        };
    }

    get addItems() {
        return (event) => {
            this.data.items.push({
                SectionFilter: this.data.section.Code || this.data.section.code,
                BuyerCodeFilter: this.data.buyerAgent.Code || this.data.buyerAgent.code,
                details: []
            });
        };
    }

    get removeItems() {
        return (event) => {
            this.error = null;
        };
    }

    paymentTermChanged() {
        this.data.lcNo = null;
        this.data.issuedBy = null;
    }

    selectedSectionChanged(newValue) {
        if (newValue != this.data.section && this.data.items)
            this.data.items.splice(0);
        this.data.section = null;
        if (newValue) {
            this.data.section = newValue;
        }
    }

    selectedBuyerChanged(newValue) {
        if (newValue != this.data.buyerAgent && this.data.items)
            this.data.items.splice(0);
        this.data.buyerAgent = null;
        if (newValue) {
            this.data.buyerAgent = newValue;
        }
    }

    selectedInvoiceTypeChanged(newValue){
        if (newValue != this.data.invoiceType && this.data.items){
            this.data.items.splice(0);
            if(this.data.measurements)
                this.data.measurements.splice(0);
        }
        if (newValue) {
            this.data.invoiceType = newValue;
        }
    }

    selectedLCChanged(newValue) {
        if (newValue) {
            this.data.lcNo = newValue.documentCreditNo;
        } else {
            this.data.lcNo = null;
        }
    }

    get totalCBM() {
        var total = 0;
        if (this.data.measurements) {
            for (var m of this.data.measurements) {
                if (m.length && m.width && m.height && m.cartonsQuantity) {
                    total += (m.length * m.width * m.height * m.cartonsQuantity / 1000000);
                }
            }
        }
        return total.toLocaleString('en-EN', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
    }

    get totalCartons() {
        let cartons = [];
        if (this.data.items) {
            for (var item of this.data.items) {
                if (item.details) {
                    for (var detail of item.details) {
                        if (detail.cartonQuantity && cartons.findIndex(c => c.carton1 == detail.carton1 && c.carton2 == detail.carton2 && c.index == detail.index) < 0) {
                            cartons.push({ carton1: detail.carton1, carton2: detail.carton2, index: detail.index, cartonQuantity: detail.cartonQuantity });
                        }
                    }
                }
            }
        }
        this.data.totalCartons = cartons.reduce((acc, cur) => acc + cur.cartonQuantity, 0);
        return this.data.totalCartons;
    }

    get totalQuantities() {
        let quantities = [];
        let result = [];
        let units = [];
        if (this.data.items) {
            var no = 1;
            for (var item of this.data.items) {
                let unit = item.uom.unit || item.uom.Unit;
                if (item.quantity && quantities.findIndex(c => c.roNo == item.roNo && c.unit == unit) < 0) {
                    quantities.push({ no: no, roNo: item.roNo, unit: unit, quantityTotal: item.quantity });
                    if(units.findIndex(u => u.unit == unit) < 0) {
                        units.push({ unit: unit });
                    }
                }
                no++;
                
            }
        }
        for (var u of units) {
            let countableQuantities = 0;
            for (var q of quantities) {
                if (q.unit == u.unit) {
                    countableQuantities += q.quantityTotal;
                }
            }
            result.push(countableQuantities + " " + u.unit);
        }
        return result.join(" / ");
    }

    noImage = "images/no-image.jpg";

    @bindable shippingMarkImageSrc;
    @bindable shippingMarkImageUpload;
    shippingMarkImageUploadChanged(newValue) {
        this.uploadImage('shippingMark', newValue);
    }

    @bindable sideMarkImageSrc;
    @bindable sideMarkImageUpload;
    sideMarkImageUploadChanged(newValue) {
        this.uploadImage('sideMark', newValue);
    }

    @bindable remarkImageSrc;
    @bindable remarkImageUpload;
    remarkImageUploadChanged(newValue) {
        this.uploadImage('remark', newValue);
    }

    uploadImage(mark, newValue) {
        if (newValue) {
            let imageInput = document.getElementById(mark + 'ImageInput');
            let reader = new FileReader();
            reader.onload = event => {
                let base64Image = event.target.result;
                const base64Content = base64Image.substring(base64Image.indexOf(',') + 1);

                if (base64Content.length * 6 / 8 > 5242880) {
                    this[mark + 'ImageSrc'] = this.noImage;
                    this.data[mark + 'ImageFile'] = null;
                    alert("Maximum Document Size is 5 MB");
                } else {
                    this[mark + 'ImageSrc'] = this.data[mark + 'ImageFile'] = base64Image;
                }
            }
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            this[mark + 'ImageSrc'] = this.noImage;
            this.data[mark + 'ImageFile'] = null;
        }
    }

    removeImage(mark) {
        this[mark + "ImageSrc"] = this.noImage;
        this.data[mark + "ImageFile"] = null;
    }

    get shippingStaffLoader() {
      return ShippingStaffLoader;
    }

    shippingStaffView = (data) => {
        return `${data.Name || data.name}`
    }

    
}
