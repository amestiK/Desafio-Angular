import {Component, ElementRef, OnInit, Renderer2, ViewChild,} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators,} from '@angular/forms';

@Component({
  selector: 'app-donation',
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.scss'],
})
export class DonationComponent implements OnInit {
  @ViewChild('bannerEle') bannerEle: ElementRef;

  statePopUp = false;
  donationGoal: number = 250;
  donationCollected: number = 0;
  countDonators: number;
  days: number;
  gif: string = '';
  donForm: FormGroup;
  donationExceeded;

  get valueDonEntered() {
    return this.donForm.get('valueDonEntered');
  }

  constructor(private renderer2: Renderer2) {}

  ngOnInit(): void {
    this.createForm();

    this.calculateDateDiff();

    localStorage.getItem('donationCollected') !== null
      ? parseInt(localStorage.getItem('donationCollected'))
      : localStorage.setItem('donationCollected', '0');

    this.donationCollected = parseInt(
      localStorage.getItem('donationCollected')
    );

    localStorage.getItem('countDonators') !== null
      ? parseInt(localStorage.getItem('countDonators'))
      : localStorage.setItem('countDonators', '0');

    this.countDonators = parseInt(localStorage.getItem('countDonators'));

    this.getGif();
  }

  ngAfterViewInit(): void {
    if (this.donationCollected >= this.donationGoal) {
      if (this.bannerEle) {
        setTimeout(() => {
          this.updateBanner();
        }, 0);
      }
    }

    setTimeout(() => {
      this.validateCurrentDonDate();
    }, 0);
  }

  createForm() {
    this.donForm = new FormGroup({
      valueDonEntered: new FormControl('', [
        Validators.required,
        Validators.max(250),
        Validators.min(1),
        this.validateSumDonation(),
      ]),
    });
  }

  addDonation() {
    this.donationCollected =
      this.donationCollected +
      parseInt(this.donForm.get('valueDonEntered').value);
    this.countDonators += 1;
    localStorage.setItem('countDonators', this.countDonators.toString());
    localStorage.setItem(
      'donationCollected',
      this.donationCollected.toString()
    );

    if (this.donationCollected >= this.donationGoal) {
      this.updateBanner();
      this.statePopUp = true;
    }

    this.donForm.get('valueDonEntered').reset();
    this.donForm.reset();
  }

  updateBanner() {
    const bannerEle = this.bannerEle.nativeElement;
    bannerEle.innerText = `¡Increíble! Hemos llegado a la meta y reunido $${this.donationCollected}. Gracias a todos por donar <3`;
    this.renderer2.addClass(bannerEle, 'done');
    this.donForm.controls['valueDonEntered'].disable();
  }

  getGif() {
    fetch(
      'https://api.giphy.com/v1/gifs/search?api_key=oQ0KWeJyXKnkVqe4m5QMDHZfmaBfyhOt&q=congratulations&limit=10'
    ).then((resp) =>
      resp.json().then((data) => {
        this.gif = data.data[Math.floor(Math.random() * 9)].images.original.url;
      })
    );
  }

  validateSumDonation(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const donacion = control.value + this.donationCollected > 250;

      if (donacion) {
        this.donationExceeded = true;
      } else {
        this.donationExceeded = false;
        return null;
      }

      return donacion ? { donacion: { value: control.value } } : null;
    };
  }

  calculateDateDiff() {
    let currentDate = new Date(Date.now());
    let dateToFinish = new Date('2023-04-01');

    const time = dateToFinish.getTime() - currentDate.getTime();

    this.days = Math.ceil(time / (1000 * 3600 * 24));
  }

  validateCurrentDonDate() {
    if (this.days < 0 && this.donationCollected < this.donationGoal) {
      const bannerEle = this.bannerEle.nativeElement;
      bannerEle.innerText = `Lamentablemente no hemos llegado a la meta. Lo sentimos, el mondo recaudado fue de $${this.donationCollected}.`;
      this.donForm.controls['valueDonEntered'].disable();
    }
  }

  hideModal() {
    this.statePopUp = false;
  }
}
