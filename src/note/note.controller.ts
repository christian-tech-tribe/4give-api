import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { NoteService } from './note.service';
import { ResponseSuccess, ResponseError } from '../common/dto/response.dto';
import { IResponse } from '../common/interfaces/response.interface';
import { AddNoteDTO } from './dto/add-note.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { ModifyNoteDTO } from './dto/modify-note.dto';
import { NoteType } from './entity/note.entity';

@ApiBearerAuth()
@Controller('/api/v1/note')
@ApiTags('Note')
@UseInterceptors(LoggingInterceptor)
@UseGuards(JwtAuthGuard)
export class NoteController {

    constructor(private readonly noteService: NoteService) { }

    @Post('/')
    async create(@Body() addNote: AddNoteDTO, @Req() request: Request): Promise<IResponse> {
        try {
            addNote.creatorEmail = request.headers['X-Auth-Email']
            addNote.creatorName = request.headers["X-Auth-Fullname"]
            let note = await this.noteService.create(addNote);
            return new ResponseSuccess('COMMON.SUCCESS', note);
        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error?.message);
        }
    }

    @Put('/')
    async update(@Body() modifyNote: ModifyNoteDTO, @Req() request: Request): Promise<IResponse> {
        try {
            modifyNote.updaterEmail = request.headers['X-Auth-Email']
            modifyNote.updaterName = request.headers["X-Auth-Fullname"]
            let note = await this.noteService.update(modifyNote);
            return new ResponseSuccess('COMMON.SUCCESS', note);
        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error?.message);
        }
    }

    @Get('/:donorId')
    async findByDonor(@Param('donorId') donorId: number): Promise<IResponse> {
        try {
            let notes = await this.noteService.findByDonor(donorId);
            return new ResponseSuccess('COMMON.SUCCESS', notes);
        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error?.message);
        }
    }

    @Get('/:donorId/notes')
    async findByDonorNotes(@Param('donorId') donorId: number): Promise<IResponse> {
        try {
            let notes = await this.noteService.findByDonorAndType(donorId, NoteType.NOTE);
            return new ResponseSuccess('COMMON.SUCCESS', notes);
        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error?.message);
        }
    }

    @Get('/:donorId/actions')
    async findByDonorActions(@Param('donorId') donorId: number): Promise<IResponse> {
        try {
            let notes = await this.noteService.findByDonorAndType(donorId, NoteType.ACTION);
            return new ResponseSuccess('COMMON.SUCCESS', notes);
        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error?.message);
        }
    }

    @Delete('/:noteId')
    async delete(@Param('noteId') noteId: number): Promise<IResponse> {
        try {
            await this.noteService.delete(noteId);
            return new ResponseSuccess('COMMON.SUCCESS');
        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error?.message);
        }
    }

}
