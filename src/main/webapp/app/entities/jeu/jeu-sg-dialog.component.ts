import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { JeuSg } from './jeu-sg.model';
import { JeuSgPopupService } from './jeu-sg-popup.service';
import { JeuSgService } from './jeu-sg.service';
import { EvenementSg, EvenementSgService } from '../evenement';
import { User, UserService } from '../../shared';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-jeu-sg-dialog',
    templateUrl: './jeu-sg-dialog.component.html'
})
export class JeuSgDialogComponent implements OnInit {

    jeu: JeuSg;
    isSaving: boolean;

    evenements: EvenementSg[];

    users: User[];

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private alertService: JhiAlertService,
        private jeuService: JeuSgService,
        private evenementService: EvenementSgService,
        private userService: UserService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.evenementService.query()
            .subscribe((res: ResponseWrapper) => { this.evenements = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.userService.query()
            .subscribe((res: ResponseWrapper) => { this.users = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, jeu, field, isImage) {
        if (event && event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (isImage && !/^image\//.test(file.type)) {
                return;
            }
            this.dataUtils.toBase64(file, (base64Data) => {
                jeu[field] = base64Data;
                jeu[`${field}ContentType`] = file.type;
            });
        }
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.jeu.id !== undefined) {
            this.subscribeToSaveResponse(
                this.jeuService.update(this.jeu));
        } else {
            this.subscribeToSaveResponse(
                this.jeuService.create(this.jeu));
        }
    }

    private subscribeToSaveResponse(result: Observable<JeuSg>) {
        result.subscribe((res: JeuSg) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: JeuSg) {
        this.eventManager.broadcast({ name: 'jeuListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    trackEvenementById(index: number, item: EvenementSg) {
        return item.id;
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}

@Component({
    selector: 'jhi-jeu-sg-popup',
    template: ''
})
export class JeuSgPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private jeuPopupService: JeuSgPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.jeuPopupService
                    .open(JeuSgDialogComponent as Component, params['id']);
            } else {
                this.jeuPopupService
                    .open(JeuSgDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
