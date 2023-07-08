import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

// for image
import { writeFile } from 'fs';
import { v4 } from 'uuid';
import { promisify } from 'util';
import * as path from 'path';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private blogsRepository: Repository<Blog>,
  ) {}

  async create(createBlogDto: CreateBlogDto): Promise<any> {
    const user = new User();
    user.id = 1;

    const blog = new Blog();
    blog.topic = createBlogDto.topic;
    blog.user = user;
    blog.photo = await this.saveImageToDisk(createBlogDto.photo); // return file name with type
    await this.blogsRepository.save(blog);

    return {
      photo: blog.photo,
      message: 'Insert blog and upload file success!',
    };
  }

  findAll(): Promise<Blog[]> {
    // const blogs = this.blogsRepository.find({
    //   relations: ['user'],
    // });
    const blogs = this.blogsRepository
      .createQueryBuilder('blog')
      .innerJoinAndSelect('blog.user', 'user')
      .select(['blog', 'user.id', 'user.fullname'])
      .getMany();
    return blogs;
  }

  findOne(id: number) {
    return `This action returns a #${id} blog`;
  }

  update(id: number, updateBlogDto: UpdateBlogDto) {
    return `This action updates a #${id} blog`;
  }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }

  async saveImageToDisk(baseImage: any) {
    const projectPath = path.resolve('./');
    const uploadPath = `${projectPath}/public/images/`;
    const ext = baseImage.substring(
      baseImage.indexOf('/') + 1,
      baseImage.indexOf(';base64'),
    );

    let filename = '';
    if (ext === 'svg+xml') {
      filename = `${v4()}.svg`;
    } else {
      filename = `${v4()}.${ext}`;
    }

    let imgData = this.decodeBase64Image(baseImage);

    const writeFileAsync = promisify(writeFile);
    await writeFileAsync(uploadPath + filename, imgData, 'base64');
    return filename;
  }

  decodeBase64Image(base64Str: string) {
    let matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string');
    }
    return matches[2];
  }
}
