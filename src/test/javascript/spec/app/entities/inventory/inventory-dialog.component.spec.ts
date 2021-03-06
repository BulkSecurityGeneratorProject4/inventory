/* tslint:disable max-line-length */
import {async, ComponentFixture, fakeAsync, inject, TestBed, tick} from "@angular/core/testing";
import {HttpResponse} from "@angular/common/http";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Observable} from "rxjs/Observable";
import {JhiEventManager} from "ng-jhipster";

import {InventoryTestModule} from "../../../test.module";
import {InventoryDialogComponent} from "../../../../../../main/webapp/app/entities/inventory/inventory-dialog.component";
import {InventoryService} from "../../../../../../main/webapp/app/entities/inventory/inventory.service";
import {Inventory} from "../../../../../../main/webapp/app/entities/inventory/inventory.model";
import {WarehouseService} from "../../../../../../main/webapp/app/entities/warehouse";
import {SteelPipeService} from "../../../../../../main/webapp/app/entities/steel-pipe";
import {CustomerService} from "../../../../../../main/webapp/app/entities/customer";
import {InventoryReportService} from "../../../../../../main/webapp/app/entities/inventory-report";

describe('Component Tests', () => {

    describe('Inventory Management Dialog Component', () => {
        let comp: InventoryDialogComponent;
        let fixture: ComponentFixture<InventoryDialogComponent>;
        let service: InventoryService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [InventoryTestModule],
                declarations: [InventoryDialogComponent],
                providers: [
                    WarehouseService,
                    SteelPipeService,
                    CustomerService,
                    InventoryReportService,
                    InventoryService
                ]
            })
            .overrideTemplate(InventoryDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(InventoryDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(InventoryService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Inventory(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.inventory = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'inventoryListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Inventory();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.inventory = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'inventoryListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
