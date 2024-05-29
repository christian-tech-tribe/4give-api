import { Inject, Injectable } from '@nestjs/common';
import { Donor } from 'src/donors/entity/donor.entity';
import { Repository, UpdateResult } from 'typeorm';
import { Note, NoteType } from './entity/note.entity';
import { AddNoteDTO } from './dto/add-note.dto';
import { ModifyNoteDTO } from './dto/modify-note.dto';

@Injectable()
export class NoteService {

    constructor(
        @Inject('DONOR_REPOSITORY') private readonly donorRepository: Repository<Donor>,
        @Inject('NOTE_REPOSITORY') private readonly noteRepository: Repository<Note>,
    ) {}

    async create(addNote: AddNoteDTO): Promise<Note> {
        let donorDB = await this.donorRepository.findOne({
            where: {
                id: addNote.idDonor
            }
        })
        if (!donorDB) {
            throw Error("Donor not found")
        }
        let noteDB = this.noteRepository.create({
            creatorName: addNote.creatorName,
            creatorEmail: addNote.creatorEmail,
            donor: donorDB,
            text: addNote.text
        })
        await this.noteRepository.insert(noteDB)
        return noteDB
    }

    async update(modifyNote: ModifyNoteDTO) : Promise<UpdateResult> {
        return await this.noteRepository.update({
            id: modifyNote.idNote
        }, {
            text: modifyNote.text,
            lastModification: new Date(),
            updaterEmail: modifyNote.updaterEmail,
            updaterName: modifyNote.updaterName
        })
    }

    async delete(idNote: number) {
        await this.noteRepository.delete({
            id: idNote
        })
    }

    async findByDonor(donorId: number) : Promise<Note[]> {
        console.log(donorId)
        return await this.noteRepository.find({
            where: {
                donor: {
                    id: donorId
                }
            },
            order: {
                creation: 'DESC'
            }
        })
    }

    async findByDonorAndType(donorId: number, type: NoteType) : Promise<Note[]> {
        console.log(donorId)
        return await this.noteRepository.find({
            where: {
                type,
                donor: {
                    id: donorId
                }
            },
            order: {
                creation: 'DESC'
            }
        })
    }

}
