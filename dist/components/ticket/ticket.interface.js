"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TicketType;
(function (TicketType) {
    TicketType[TicketType["PAID"] = 0] = "PAID";
    TicketType[TicketType["FREE"] = 1] = "FREE";
    TicketType[TicketType["DONATION"] = 2] = "DONATION";
})(TicketType || (TicketType = {}));
var FEEPAYER;
(function (FEEPAYER) {
    FEEPAYER[FEEPAYER["ME"] = 0] = "ME";
    FEEPAYER[FEEPAYER["BUYER"] = 1] = "BUYER";
})(FEEPAYER || (FEEPAYER = {}));
//# sourceMappingURL=ticket.interface.js.map