import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager, JhiAlertService} from 'ng-jhipster';
import {TranslateService} from '@ngx-translate/core';

import { EvenementSg } from './evenement-sg.model';
import { EvenementSgPopupService } from './evenement-sg-popup.service';
import { EvenementSgService } from './evenement-sg.service';
import { JeuSg, JeuSgService } from '../jeu';
import { SphereSg, SphereSgService } from '../sphere';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-evenement-sg-dialog',
    templateUrl: './evenement-sg-dialog.component.html'
})
export class EvenementSgDialogComponent implements OnInit {

    evenement: EvenementSg;
    isSaving: boolean;

    dropdownOptions = {};

    jeus: any[] = [];

    spheres: SphereSg[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private evenementService: EvenementSgService,
        private jeuService: JeuSgService,
        private sphereService: SphereSgService,
        private eventManager: JhiEventManager,
        private serviceTraduction: TranslateService
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.jeuService.getJeuSphere(this.evenement.sphereId).subscribe(
            (res: ResponseWrapper) => this.initJeux(res),
            (res: ResponseWrapper) => this.onError(res.json)
        );
        this.sphereService.query()
            .subscribe((res: ResponseWrapper) => { this.spheres = res.json; }, (res: ResponseWrapper) => this.onError(res.json));

        this.dropdownOptions = {
            singleSelection: false,
            text: this.serviceTraduction.instant('socialGameApp.evenement.dropdown.placeholder'),
            selectAllText: this.serviceTraduction.instant('socialGameApp.evenement.dropdown.toutSelectionner'),
            unSelectAllText: this.serviceTraduction.instant('socialGameApp.evenement.dropdown.toutDeselectionner'),
            enableSearchFilter: true,
            classes: ""
        }
    }

    initJeux(data) {

        for (const jeu of data) {
            this.jeus.push({
                id: jeu.id,
                itemName: jeu.nom
            })
        }

    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.evenement.id !== undefined) {
            this.subscribeToSaveResponse(
                this.evenementService.update(this.evenement));
        } else {
            this.subscribeToSaveResponse(
                this.evenementService.create(this.evenement));
        }
    }

    private subscribeToSaveResponse(result: Observable<EvenementSg>) {
        result.subscribe((res: EvenementSg) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: EvenementSg) {
        this.eventManager.broadcast({ name: 'evenementListModification', content: 'OK'});
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

    trackJeuById(index: number, item: JeuSg) {
        return item.id;
    }

    trackSphereById(index: number, item: SphereSg) {
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
    selector: 'jhi-evenement-sg-popup',
    template: ''
})
export class EvenementSgPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private evenementPopupService: EvenementSgPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.evenementPopupService
                    .open(EvenementSgDialogComponent as Component, params['id']);
            } else if ( params['idSphere'] ) {
                this.evenementPopupService
                    .open(EvenementSgDialogComponent as Component, null, params['idSphere']);
            } else {
                this.evenementPopupService
                    .open(EvenementSgDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
