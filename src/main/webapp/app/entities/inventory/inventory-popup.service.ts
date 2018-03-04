import {Component, Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {HttpResponse} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import {Inventory} from "./inventory.model";
import {InventoryService} from "./inventory.service";

@Injectable()
export class InventoryPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private inventoryService: InventoryService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.inventoryService.find(id)
                    .subscribe((inventoryResponse: HttpResponse<Inventory>) => {
                        const inventory: Inventory = inventoryResponse.body;
                        inventory.entryDate = this.datePipe
                            .transform(inventory.entryDate, 'yyyy-MM-ddTHH:mm:ss');
                        inventory.exitDate = this.datePipe
                            .transform(inventory.exitDate, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.inventoryModalRef(component, inventory);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.inventoryModalRef(component, new Inventory());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    inventoryModalRef(component: Component, inventory: Inventory): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.inventory = inventory;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
