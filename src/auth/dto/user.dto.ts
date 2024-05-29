import { PlatformRole, UserStatus } from "../schema/user.schema";
import { DocumentDto } from "./document.dto";

export class UserDto extends DocumentDto {

  constructor(object: any) {
    super(object)
    this.getField(object, "email")
    this.getField(object, "name")
    this.getField(object, "fullname")
    this.getField(object, "creationDate")
    this.getField(object, "platformRoles")
    this.getField(object, "settings")
    this.getField(object, "status")
    this.getField(object, "thumbnail")
  }

  readonly name: String;

  readonly fullname: String;

  readonly email: String;

  readonly creationDate: Date;

  readonly thumbnail: String;

  readonly platformRoles: [PlatformRole];

  readonly settings: {};

  readonly status: UserStatus;

}