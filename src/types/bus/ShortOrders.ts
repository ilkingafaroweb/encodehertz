export type ShortOrders = {
    Id: number;
    Customer: string;
    CustomerName: string;
    OutsourceVehicle: string;
    StartDate: string;
    EndDate: string;
    ServiceType: string;
    HourInterval: number;
    TourSelect: string;
    FromRegion: string;
    ToRegion: string;
    From: string;
    To: string;
    Source: string;
    Address: string
    VehicleClass: string
    Vehicle: string;
    Driver: string;
    PriceToCustomer: number;
    CustomerPaymentMethod: string;
    Supplier: string;
    PriceToOutsource: number;
    OutsourcePaymentMethod: string;
    RequestedPerson: string;
    Comment: string;
    ExtraCharges: number
}