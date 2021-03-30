import { Model, Type } from 'utils/model';

interface IModel {
  mobile: Number;
  password: String;
  name: String;
}

export default class Users extends Model<IModel> {
  public name = 'users';
  public model = {
    mobile: Type.number,
    password: Type.string,
    name: Type.string,
  };
}
