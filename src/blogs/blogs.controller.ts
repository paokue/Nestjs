import { Controller, Get } from '@nestjs/common';
import { BlogsService } from './blogs.service';

@Controller('blogs')
export class BlogsController {
    constructor(private readonly blogService: BlogsService){}

    @Get() // we call use path like @Get("all")
    findAll() {
        return this.blogService.getBlog();
    }
}
