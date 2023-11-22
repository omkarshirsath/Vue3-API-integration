export interface User {
    id : string,
    picture:
    {
        medium :string;
    }
    name :{
        first : string;
        last :string;
    };
        email : string;
        phone : string;
}