

let Tradings = {

    tradeData: null,
    eras: null,
    dealerTrades: null,
    playerTrades: null,
    myTrades: null,

    tradeWindowMenu: null,
    tradeWindow: null,
    buttons: {
        showGrouped: null,
        showComplete: null,
    },

    tables: {
        grouped: null,
        complete: null,
        actual: 'grouped',
        hideAll: function(){
            Tradings.tables.grouped.hide();
            Tradings.tables.complete.hide();
        }
    },

    showGrouped: function(e){

        Tradings.buttons.showGrouped.css('font-weight', 'bold');
        Tradings.buttons.showComplete.css('font-weight', 'normal');

        Tradings.tables.hideAll();
        Tradings.tables.grouped.show();
        Tradings.tables.actual = 'grouped';

        console.log('Show Grouped View');
    },

    showComplete: function(e){

        Tradings.buttons.showGrouped.css('font-weight', 'normal');
        Tradings.buttons.showComplete.css('font-weight', 'bold');

        Tradings.tables.hideAll();
        Tradings.tables.complete.show();
        Tradings.tables.actual = 'complete';

        console.log('Show Complete View');
    },

    buildGroupedTradesTable: function(){

        let oldGroupedTable = Tradings.tables.grouped;


        Tradings.tables.grouped = $('<table>').addClass('trading-grouped-table');


        if(Tradings.tables.actual !== 'grouped')
        {
            Tradings.tables.grouped.hide();
        }

        Tradings.tables.grouped.append($('<tr><th>Merlins gruppierte Tabelle</th></tr>'));


        if(oldGroupedTable === null){
            Tradings.tradeWindow.append(Tradings.tables.grouped);
        } else {
            oldGroupedTable.replaceWith(Tradings.tables.grouped);
        }

    },

    buildCompleteTradesTable: function(){

        let oldCompleteTable = Tradings.tables.complete;


        Tradings.tables.complete = $('<table>').addClass('trading-complete-table');

        if(Tradings.tables.actual !== 'complete')
        {
            Tradings.tables.complete.hide();
        }

        Tradings.tables.complete.append($('<tr><th>Mogens gesamte Tabelle</th></tr>'));


        if(oldCompleteTable === null){
            Tradings.tradeWindow.append(Tradings.tables.complete);
        } else {
            oldCompleteTable.replaceWith(Tradings.tables.complete);
        }

    },

    buildTradeWindowMenu: function(){

        // Menue bauen

        if(Tradings.tradeWindowMenu === null)
        {
            Tradings.tradeWindowMenu = $('<div>');
            Tradings.tradeWindowMenu.append($('<p>Ansicht:</p>'));

            Tradings.buttons.showGrouped = $('<button>Gruppiert</button>');
            Tradings.buttons.showGrouped.css('font-weight', 'bold');
            Tradings.buttons.showGrouped.on('click', Tradings.showGrouped);

            Tradings.buttons.showComplete = $('<button>Gesamt</button>');
            Tradings.buttons.showComplete.on('click', Tradings.showComplete);


            Tradings.tradeWindowMenu.append([Tradings.buttons.showGrouped, Tradings.buttons.showComplete]);

            Tradings.tradeWindow.append(Tradings.tradeWindowMenu);
        }




    },
    buildTradeWindow: function(){


        console.log('Building Trade Window');

        if(document.getElementById('tradeWindow') == null) {
            HTML.Box({id:'tradeWindow', title:'Handelsangebote', dragdrop:true, auto_close:false, minimize: true/*, resize:true*/});
        }

        Tradings.tradeWindow = $('<div>');

        Tradings.buildTradeWindowMenu();
        // Tradings.tradeWindow.append(Tradings.tradeWindowMenu);

        Tradings.buildGroupedTradesTable();
        Tradings.buildCompleteTradesTable();


        $('#tradeWindowBody').append(Tradings.tradeWindow);

    },

    handleTradeData: function(buildTradeWindowCallbackFunction){

        Tradings.dealerTrades = Tradings.tradeData.filter(e=>e.merchant.player_id === -1);
        Tradings.playerTrades = Tradings.tradeData.filter(e=>e.merchant.player_id !== -1 && e.merchant.player_id !== ExtPlayerID);
        Tradings.myTrades = Tradings.tradeData.filter(e=>e.merchant.player_id === ExtPlayerID);


        // console.log(Tradings.dealerTrades);
        // console.log(Tradings.playerTrades);
        // console.log(Tradings.myTrades);
        //
        // console.log('MyPlayerId', ExtPlayerID);
        // console.log('MyEraID', CurrentEraID);
        // console.log('Technologies', Technologies);
        // console.log('GoodsData', GoodsData);
        // console.log('eras', Tradings.eras);


        buildTradeWindowCallbackFunction();



    },

    fetchTradeData: function(tradeOfferResponse, handleTradeDataCallbackFunction){
        Tradings.tradeData = tradeOfferResponse['responseData'];
        Tradings.eras = Technologies['Eras'];
        handleTradeDataCallbackFunction(Tradings.buildTradeWindow);
    },

    tradeCB_handler: function(tradeOfferResponse){
        Tradings.fetchTradeData(tradeOfferResponse, Tradings.handleTradeData);
    },

    addTradeHandler: function(){
        FoEproxy.addHandler('TradeService', 'getTradeOffers', Tradings.tradeCB_handler);
    },

    init: function(){
        Tradings.addTradeHandler();
    }

};

Tradings.init();
