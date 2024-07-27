import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Param,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/signup/schema/user.schema';
import { user } from 'src/signup/dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/path-to/multer.config';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('getuser/:id')
  getUser(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Post('updateuser/:id')
  @UseInterceptors(FileInterceptor('profileImage', multerConfig))
  async updateUser(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5e6 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    profileImage: Express.Multer.File,
    @Body() userData: user,
  ): Promise<User> {
    const updateData = { ...userData };
    if (profileImage) {
      updateData.profileImage = profileImage.path;
    }
    return this.userService.updateUserById(id, updateData);
  }
}
