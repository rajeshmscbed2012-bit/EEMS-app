/* script.js (robust version for full multi-step form with simple ERCP step) */
(() => {
  const app = {
    state: {
      currentStep: 1,
      totalSteps: 0,
      language: localStorage.getItem('eems_lang') || 'en',
      photos: [],
      multiselect: { symptoms: new Set(), history: new Set(), care: new Set() },
      signatures: { emt: { drawn: false, dataUrl: null }, staff: { drawn: false, dataUrl: null } },
      draftKey: 'eems_draft'
    },

    els: {},

    i18n: {
      en: {
        title: "EEMS Pre-Hospital Care Record",
        subtitle: "EMRI GREEN HEALTH SERVICES – GVK EMRI<br>108 Emergency Ambulance Service",
        case_details: "Case Details",
        patient_name: "Patient Name",
        gender: "Gender",
        age_group: "Age Group",
        age: "Age",
        loc: "Level of Consciousness (AVPU)",
        breathing: "Breathing Pattern",
        chief_complaint: "Chief Complaint",
        triage: "Triage Category",
        critical: "Critical Patient",
        patient_address: "Patient Address",
        ration_card: "Ration Card Type",
        social_status: "Social Status",
        id_proof: "ID Proof Number",
        contact: "Contact Number",
        address: "Address",
        signs_symptoms: "Signs & Symptoms",
        select_symptoms: "Select all applicable symptoms",
        vitals: "Vital Signs",
        care_history: "Pre-Hospital Care & History",
        past_history: "Past Medical History",
        medications: "Current Medications",
        allergies: "Allergies",
        interventions: "Interventions Performed",
        medications_given: "Medications Administered",
        transport_events: "Events During Transport",
        admission: "Admission Details",
        hospital_name: "Receiving Hospital",
        handover_time: "Handover Time",
        receiving_staff: "Receiving Staff Name",
        staff_designation: "Staff Designation",
        handover_notes: "Handover Notes",
        emt_name: "EMT Name",
        pilot_name: "Pilot/Driver Name",
        vehicle_number: "Ambulance Number",
        preview_print: "Preview & Print",
        ercp_advice: "ERCP Advice",
        ercp_consultant_name: "Name",
        ercp_advice_text: "Advice"
      },
      ta: {
        title: "EEMS முன்-மருத்துவ பராமரிப்பு பதிவேடு",
        subtitle: "EMRI GREEN HEALTH SERVICES – GVK EMRI<br>108 அவசர அம்புலன்ஸ் சேவை",
        case_details: "வழக்கு விவரங்கள்",
        patient_name: "நோயாளியின் பெயர்",
        gender: "பாலினம்",
        age_group: "வயது குழு",
        age: "வயது",
        loc: "விழிப்புணர்வு நிலை (AVPU)",
        breathing: "சுவாச நிலை",
        chief_complaint: "முக்கிய புகார்",
        triage: "ட்ரயாஜ் வகை",
        critical: "மிகக் கடுமையான நோயாளி",
        patient_address: "நோயாளியின் முகவரி",
        ration_card: "ரேஷன் அட்டை வகை",
        social_status: "சமூக நிலை",
        id_proof: "அடையாள சான்று எண்",
        contact: "தொடர்பு எண்",
        address: "முகவரி",
        signs_symptoms: "அடையாளங்கள் & அறிகுறிகள்",
        select_symptoms: "தொடர்புடைய அனைத்து அறிகுறிகளையும் தேர்ந்தெடுக்கவும்",
        vitals: "முக்கிய உயிரியல் அளவுகள்",
        care_history: "முன்-மருத்துவ பராமரிப்பு & வரலாறு",
        past_history: "முந்தைய மருத்துவ வரலாறு",
        medications: "தற்போதைய மருந்துகள்",
        allergies: "அலர்ஜிகள்",
        interventions: "செய்யப்பட்ட தலையீடுகள்",
        medications_given: "கொடுக்கப்பட்ட மருந்துகள்",
        transport_events: "போக்குவரத்தின்போது நிகழ்வுகள்",
        admission: "சேர்க்கை விவரங்கள்",
        hospital_name: "பெறும் மருத்துவமனை",
        handover_time: "ஏற்பு நேரம்",
        receiving_staff: "ஏற்றுக் கொள்கிற பணியாளரின் பெயர்",
        staff_designation: "பணியாளர் பதவி",
        handover_notes: "கையளிப்பு குறிப்புகள்",
        emt_name: "EMT பெயர்",
        pilot_name: "பைலட்/டிரைவர் பெயர்",
        vehicle_number: "அம்புலன்ஸ் எண்",
        preview_print: "முன்தோற்றம் & அச்சிடு",
        ercp_advice: "ERCP ஆலோசனை",
        ercp_consultant_name: "பெயர்",
        ercp_advice_text: "ஆலோசனை"
      }
    },

    options: {
      symptoms: [
        { value: "chest_pain", label: "Chest pain" },
        { value: "shortness_breath", label: "Shortness of breath" },
        { value: "fever", label: "Fever" },
        { value: "cough", label: "Cough" },
        { value: "headache", label: "Headache" },
        { value: "abdominal_pain", label: "Abdominal pain" },
        { value: "vomiting", label: "Vomiting" },
        { value: "diarrhea", label: "Diarrhea" },
        { value: "seizure", label: "Seizure" },
        { value: "altered_mental_status", label: "Altered mental status" },
        { value: "trauma", label: "Trauma" },
        { value: "bleeding", label: "Active bleeding" },
        { value: "fracture", label: "Suspected fracture" },
        { value: "burn", label: "Burn" },
        { value: "stroke_signs", label: "Stroke symptoms (FAST)" },
        { value: "weakness", label: "Weakness" },
        { value: "dizziness", label: "Dizziness" },
        { value: "palpitations", label: "Palpitations" },
        { value: "pregnancy", label: "Pregnancy-related complaint" },
        { value: "back_pain", label: "Back pain" },
        { value: "rash", label: "Rash" },
        { value: "anaphylaxis", label: "Anaphylaxis / Swelling" },
        { value: "unconscious", label: "Unconscious" }
      ],
      history: [
        { value: "dm", label: "Diabetes" },
        { value: "htn", label: "Hypertension" },
        { value: "cad", label: "Coronary artery disease" },
        { value: "asthma", label: "Asthma" },
        { value: "copd", label: "COPD" },
        { value: "epilepsy", label: "Epilepsy" },
        { value: "ckd", label: "Chronic kidney disease" },
        { value: "cld", label: "Chronic liver disease" },
        { value: "stroke", label: "Stroke" },
        { value: "thyroid", label: "Thyroid disorder" },
        { value: "tb", label: "Tuberculosis" },
        { value: "hiv", label: "HIV" },
        { value: "cancer", label: "Cancer" },
        { value: "psychiatric", label: "Psychiatric illness" },
        { value: "pregnancy", label: "Pregnancy" },
        { value: "surgery", label: "Past surgeries" },
        { value: "allergy", label: "Known allergies" }
      ],
      care: [
        { value: "airway_positioning", label: "Airway positioning" },
        { value: "opa_npa", label: "OPA/NPA insertion" },
        { value: "bvm", label: "BVM ventilation" },
        { value: "oxygen", label: "Oxygen administration" },
        { value: "nebulization", label: "Nebulization" },
        { value: "suction", label: "Airway suction" },
        { value: "iv_cannula", label: "IV cannulation" },
        { value: "fluids", label: "IV fluids (NS/RL)" },
        { value: "dextrose", label: "Dextrose (hypoglycemia)" },
        { value: "glucose_gel", label: "Oral glucose" },
        { value: "aspirin", label: "Aspirin given" },
        { value: "ntg", label: "Nitroglycerin (if indicated)" },
        { value: "adrenaline", label: "Adrenaline IM (anaphylaxis)" },
        { value: "aed", label: "AED / Defibrillation" },
        { value: "cpr", label: "CPR" },
        { value: "c_spine", label: "C-spine immobilization" },
        { value: "splinting", label: "Splinting" },
        { value: "bleeding_control", label: "Bleeding control" },
        { value: "burn_dressing", label: "Burn dressing" },
        { value: "wound_dressing", label: "Wound dressing" },
        { value: "analgesia", label: "Pain management" },
        { value: "antiemetic", label: "Antiemetic" }
      ]
    },

    init() {
      this.cache();
      if (!this.els.form) {
        console.error('eemsForm not found. Make sure you’re using the full multi-step HTML.');
        return;
      }
      this.bind();
      this.buildProgress();
      this.buildMultiselects();
      this.restoreFromDraft();
      this.updateStepUI();
      this.initSignatures();
      this.setLanguage(this.state.language, { persist: false });
      const ageGroup = this.els.ageGroup?.value || '';
      this.toggleAgeFields(ageGroup);
      console.log('App initialized');
    },

    cache() {
      this.els.form = document.getElementById('eemsForm');
      this.els.steps = Array.from(document.querySelectorAll('.form-step'));
      this.state.totalSteps = this.els.steps.length;

      this.els.progressSteps = document.getElementById('progressSteps');
      this.els.progressFill = document.getElementById('progressFill');

      this.els.prevBtn = document.getElementById('prevBtn');
      this.els.nextBtn = document.getElementById('nextBtn');
      this.els.submitBtn = document.getElementById('submitBtn');

      this.els.alertContainer = document.getElementById('alertContainer');
      this.els.spinner = document.getElementById('spinner');

      this.els.ageGroup = this.els.form?.querySelector('select[name="age_group"]');
      this.els.ageYears = this.els.form?.querySelector('input[name="age_years"]');
      this.els.ageMonths = this.els.form?.querySelector('input[name="age_months"]');
      this.els.ageDays = this.els.form?.querySelector('input[name="age_days"]');

      this.els.symptoms = {
        root: document.getElementById('symptomsSelect'),
        selected: document.getElementById('symptomsSelected'),
        dropdown: document.getElementById('symptomsDropdown')
      };
      this.els.history = {
        root: document.getElementById('historySelect'),
        selected: document.getElementById('historySelected'),
        dropdown: document.getElementById('historyDropdown')
      };
      this.els.care = {
        root: document.getElementById('careSelect'),
        selected: document.getElementById('careSelected'),
        dropdown: document.getElementById('careDropdown')
      };

      this.els.photoPreview = document.getElementById('photoPreview');
      this.els.langBtns = Array.from(document.querySelectorAll('.lang-btn'));
    },

    bind() {
      const form = this.els.form;
      if (!form) return;

      form.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const tag = (e.target.tagName || '').toLowerCase();
          const isMultiOpen = document.querySelector('.multiselect.open');
          if (tag !== 'textarea' && !isMultiOpen) {
            e.preventDefault();
            this.nextStep();
          }
        }
      });

      form.addEventListener('input', (e) => this.clearErrorForEl(e.target));
      form.addEventListener('change', (e) => this.clearErrorForEl(e.target));

      document.addEventListener('click', (e) => {
        document.querySelectorAll('.multiselect.open').forEach(ms => {
          if (!ms.contains(e.target)) ms.classList.remove('open');
        });
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          document.querySelectorAll('.multiselect.open').forEach(ms => ms.classList.remove('open'));
        }
      });

      const saveDraftDebounced = this.debounce(() => this.saveDraft(), 300);
      form.addEventListener('input', saveDraftDebounced);
      form.addEventListener('change', saveDraftDebounced);

      if (this.els.ageGroup) {
        this.els.ageGroup.addEventListener('change', (e) => this.toggleAgeFields(e.target.value));
      }
    },

    // Steps / Progress
    buildProgress() {
      if (!this.els.progressSteps) return;
      const frag = document.createDocumentFragment();
      this.els.steps.forEach((stepEl, idx) => {
        const labelEl = stepEl.querySelector('.card-header h2');
        const labelText = labelEl ? labelEl.textContent.trim() : `Step ${idx + 1}`;
        const step = document.createElement('div');
        step.className = 'step';
        step.dataset.index = idx + 1;
        step.innerHTML = `
          <div class="dot">${idx + 1}</div>
          <div class="name">${labelText}</div>
        `;
        frag.appendChild(step);
      });
      this.els.progressSteps.innerHTML = '';
      this.els.progressSteps.appendChild(frag);
      this.refreshProgressUI();
    },

    refreshProgressUI() {
      if (!this.els.progressSteps || !this.els.progressFill) return;
      const { currentStep, totalSteps } = this.state;
      const steps = Array.from(this.els.progressSteps.querySelectorAll('.step'));
      steps.forEach((s, i) => {
        s.classList.remove('active', 'completed');
        if (i + 1 < currentStep) s.classList.add('completed');
        if (i + 1 === currentStep) s.classList.add('active');
      });
      const pct = totalSteps > 1 ? ((currentStep - 1) / (totalSteps - 1)) * 100 : 0;
      this.els.progressFill.style.width = `${Math.max(0, Math.min(100, pct))}%`;
    },

    updateStepUI() {
      const { currentStep, totalSteps } = this.state;
      this.els.steps.forEach((el, idx) => {
        el.classList.toggle('active', idx + 1 === currentStep);
      });

      if (this.els.prevBtn) {
        this.els.prevBtn.disabled = currentStep === 1;
        this.els.prevBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
      }

      const atLast = currentStep === totalSteps;
      if (this.els.nextBtn) this.els.nextBtn.style.display = atLast ? 'none' : '';
      if (this.els.submitBtn) this.els.submitBtn.style.display = atLast ? '' : 'none';

      this.refreshProgressUI();

      const stepEl = this.els.steps[this.state.currentStep - 1];
      if (stepEl && stepEl.id === 'previewStep') {
        this.buildPreview();
      }

      const containerTop = document.querySelector('.container')?.offsetTop || 0;
      window.scrollTo({ top: containerTop - 10, behavior: 'smooth' });
    },

    previousStep() {
      if (this.state.currentStep > 1) {
        this.state.currentStep--;
        this.updateStepUI();
      }
    },

    nextStep() {
      if (!this.validateStep(this.state.currentStep)) return;
      if (this.state.currentStep < this.state.totalSteps) {
        this.state.currentStep++;
        this.updateStepUI();
      }
    },

    // Validation
    validateStep(stepIndex) {
      const form = this.els.form;
      if (!form) return true;

      let valid = true;
      const stepEl = this.els.steps[stepIndex - 1];

      stepEl?.querySelectorAll('.form-group.error').forEach(g => {
        g.classList.remove('error');
        g.querySelector('.error-message')?.remove();
      });

      const setErr = (input, msg) => {
        valid = false;
        const group = input?.closest?.('.form-group') || stepEl || this.els.form;
        if (!group) return;
        group.classList.add('error');
        let em = group.querySelector('.error-message');
        if (!em) {
          em = document.createElement('div');
          em.className = 'error-message';
          group.appendChild(em);
        }
        em.textContent = msg;
      };

      if (stepIndex === 1) {
        const name = form.querySelector('input[name="patient_name"]');
        if (!name?.value.trim()) setErr(name, 'Please enter patient name');

        const gender = form.querySelector('input[name="gender"]:checked');
        if (!gender) setErr(form.querySelector('#gender_m') || form, 'Please select gender');

        const loc = form.querySelector('input[name="loc"]:checked');
        if (!loc) setErr(form.querySelector('#loc_a') || form, 'Please select AVPU');

        const triage = form.querySelector('input[name="triage"]:checked');
        if (!triage) setErr(form.querySelector('#triage_green') || form, 'Please select triage');

        const critical = form.querySelector('input[name="critical"]:checked');
        if (!critical) setErr(form.querySelector('#critical_no') || form, 'Please mark if patient is critical');

        const ag = form.querySelector('select[name="age_group"]')?.value || '';
        if (ag) {
          const years = this.els.ageYears?.value;
          const months = this.els.ageMonths?.value;
          const days = this.els.ageDays?.value;
          if (!years && !months && !days) {
            setErr(this.els.ageYears || form, 'Please enter age (years/months/days)');
          }
        }
      }

      if (stepIndex === 2) {
        const contact = form.querySelector('input[name="contact"]');
        const val = contact?.value.trim() || '';
        if (val && !/^\d{10}$/.test(val.replace(/\D/g, ''))) {
          setErr(contact, 'Enter 10-digit phone number');
        }
      }

      if (stepIndex === 4) {
        ['spo2_scene','spo2_enroute','spo2_hospital'].forEach(n => {
          const el = form.querySelector(`input[name="${n}"]`);
          const v = el?.value.trim();
          if (v) {
            const num = Number(v);
            if (Number.isNaN(num) || num < 0 || num > 100) setErr(el, 'SpO₂ must be 0–100');
          }
        });
        ['bp_scene','bp_enroute','bp_hospital'].forEach(n => {
          const el = form.querySelector(`input[name="${n}"]`);
          const v = el?.value.trim();
          if (v && !/^\s*\d{2,3}\s*\/\s*\d{2,3}\s*$/.test(v)) setErr(el, 'Use format: 120/80');
        });
      }

      if (stepEl && stepEl.id === 'ercpStep') {
        const nm = form.querySelector('input[name="ercp_consultant_name"]');
        const adv = form.querySelector('textarea[name="ercp_advice_text"]');
        if (!nm?.value.trim()) setErr(nm, 'Please enter name');
        if (!adv?.value.trim()) setErr(adv, 'Please enter advice');
      }

      if (!valid) this.showAlert('error', 'Please correct the highlighted fields.');
      return valid;
    },

    clearErrorForEl(el) {
      const group = el?.closest?.('.form-group');
      if (!group) return;
      group.classList.remove('error');
      group.querySelector('.error-message')?.remove();
    },

    // Alerts
    showAlert(type = 'info', message = '', timeout = 3000) {
      if (!this.els.alertContainer) return null;
      const alert = document.createElement('div');
      alert.className = `alert ${type}`;
      alert.innerHTML = `${message}`;
      this.els.alertContainer.appendChild(alert);
      if (timeout) setTimeout(() => alert.remove(), timeout);
      return alert;
    },

    // Language
    setLanguage(lang = 'en', opts = { persist: true }) {
      if (!this.i18n[lang]) return;
      this.state.language = lang;
      if (opts.persist) localStorage.setItem('eems_lang', lang);

      this.els.langBtns?.forEach(btn => {
        const isActive = btn.textContent.trim().toLowerCase().includes(lang === 'en' ? 'english' : 'தமிழ்');
        btn.classList.toggle('active', isActive);
      });

      const dict = this.i18n[lang];
      document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        const value = dict[key];
        if (typeof value === 'string') el.innerHTML = value;
      });

      this.buildProgress();
    },

    // Age fields
    toggleAgeFields(group) {
      const years = this.els.ageYears, months = this.els.ageMonths, days = this.els.ageDays;
      if (!years || !months || !days) return;

      [years, months, days].forEach(i => { i.required = false; i.disabled = false; });

      if (!group) return;
      if (group === 'adult') {
        years.required = true; months.value = ''; days.value = '';
        months.disabled = true; days.disabled = true;
      } else if (group === 'neonate') {
        years.value = ''; years.disabled = true; days.required = true;
      } else if (group === 'infant') {
        years.value = ''; years.disabled = true; months.required = true;
      } else if (group === 'pediatric') {
        years.required = true;
      }
    },

    // Multiselects
    buildMultiselects() {
      this.buildMultiselect('symptoms', this.options.symptoms);
      this.buildMultiselect('history', this.options.history);
      this.buildMultiselect('care', this.options.care);
    },

    buildMultiselect(key, options) {
      const cfg = this.els[key];
      if (!cfg?.dropdown || !cfg?.selected) return;

      const searchId = `${key}_search`;
      const listId = `${key}_list`;
      cfg.dropdown.innerHTML = `
        <div style="position: sticky; top: 0; background: #fff; padding: 6px 6px 8px;">
          <input id="${searchId}" type="text" placeholder="Search..." style="width:100%;padding:8px 10px;border:1px solid #e5e7eb;border-radius:8px;outline:none;">
        </div>
        <div id="${listId}"></div>
      `;

      const renderList = (filter = '') => {
        const list = cfg.dropdown.querySelector('#' + listId);
        if (!list) return;
        const lower = filter.trim().toLowerCase();
        list.innerHTML = '';
        options
          .filter(o => !lower || o.label.toLowerCase().includes(lower))
          .forEach(o => {
            const id = `${key}_${o.value}`;
            const row = document.createElement('label');
            row.className = 'row';
            row.innerHTML = `
              <input id="${id}" type="checkbox" value="${o.value}" ${this.state.multiselect[key].has(o.value) ? 'checked' : ''}>
              <span>${o.label}</span>
            `;
            const input = row.querySelector('input');
            input.addEventListener('change', () => {
              if (input.checked) this.state.multiselect[key].add(o.value);
              else this.state.multiselect[key].delete(o.value);
              this.refreshSelectedItems(key, options);
              this.saveDraft();
            });
            list.appendChild(row);
          });
        if (!list.children.length) {
          const empty = document.createElement('div');
          empty.style.cssText = 'padding:10px;color:#6b7280;';
          empty.textContent = 'No results';
          list.appendChild(empty);
        }
      };

      renderList();
      const search = cfg.dropdown.querySelector('#' + searchId);
      search?.addEventListener('input', (e) => renderList(e.target.value));
      this.refreshSelectedItems(key, options);
    },

    refreshSelectedItems(key, options) {
      const cfg = this.els[key];
      if (!cfg?.selected) return;
      const selected = this.state.multiselect[key];
      const selectedBox = cfg.selected;
      selectedBox.innerHTML = '';
      if (!selected.size) {
        selectedBox.innerHTML = `<span style="color:#999;">${
          key === 'symptoms' ? 'Click to select symptoms...' :
          key === 'history' ? 'Select medical history...' :
          'Select interventions...'
        }</span>`;
        return;
      }
      const frag = document.createDocumentFragment();
      selected.forEach(val => {
        const opt = options.find(o => o.value === val);
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.style.cursor = 'pointer';
        tag.title = 'Remove';
        tag.textContent = opt ? opt.label : val;
        tag.addEventListener('click', () => {
          this.state.multiselect[key].delete(val);
          const cb = document.getElementById(`${key}_${val}`);
          if (cb) cb.checked = false;
          this.refreshSelectedItems(key, options);
          this.saveDraft();
        });
        frag.appendChild(tag);
      });
      selectedBox.appendChild(frag);
    },

    toggleMultiselect(id) {
      const root = document.getElementById(id);
      if (!root) return;
      const isOpen = root.classList.contains('open');
      document.querySelectorAll('.multiselect.open').forEach(ms => ms.classList.remove('open'));
      if (!isOpen) root.classList.add('open');
    },

    // Photos
    handlePhotos(fileList) {
      const files = Array.from(fileList || []);
      files.forEach(file => {
        if (!file.type?.startsWith('image/')) return;
        const url = URL.createObjectURL(file);
        this.state.photos.push({ file, url });
      });
      this.renderPhotos();
      this.saveDraft();
    },

    renderPhotos() {
      if (!this.els.photoPreview) return;
      this.els.photoPreview.innerHTML = '';
      this.state.photos.forEach((p, idx) => {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.className = 'thumb';
        const img = document.createElement('img');
        img.src = p.url;
        img.alt = p.file?.name || `photo-${idx + 1}`;
        img.style.cssText = 'border-radius:10px;border:1px solid #e5e7eb;width:100%;height:90px;object-fit:cover;';

        const del = document.createElement('button');
        del.type = 'button';
        del.textContent = '×';
        del.setAttribute('aria-label', 'Remove photo');
        del.style.cssText = 'position:absolute;top:4px;right:4px;background:#111827;color:#fff;border:none;border-radius:50%;width:22px;height:22px;cursor:pointer;line-height:20px;font-weight:700;opacity:.8';
        del.addEventListener('click', () => {
          URL.revokeObjectURL(p.url);
          this.state.photos.splice(idx, 1);
          this.renderPhotos();
          this.saveDraft();
        });

        wrapper.appendChild(img);
        wrapper.appendChild(del);
        this.els.photoPreview.appendChild(wrapper);
      });
    },

    // Signatures
    initSignatures() {
      this.setupSignaturePad(document.getElementById('emtSignatureCanvas'), 'emt');
      this.setupSignaturePad(document.getElementById('staffSignatureCanvas'), 'staff');
    },

    setupSignaturePad(canvas, key) {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const state = { drawing: false, lastX: 0, lastY: 0 };

      const resize = () => {
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const rect = canvas.getBoundingClientRect();
        canvas.width = Math.max(300, Math.floor(rect.width * dpr));
        canvas.height = Math.max(160, Math.floor(rect.height * dpr));
        ctx.setTransform(1,0,0,1,0,0);
        ctx.scale(dpr, dpr);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, rect.width, rect.height);
      };
      setTimeout(resize, 0);
      window.addEventListener('resize', this.debounce(resize, 200));

      const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        if (e.touches && e.touches[0]) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
      };

      const start = (e) => { e.preventDefault(); const { x, y } = getPos(e); state.drawing = true; state.lastX = x; state.lastY = y; };
      const move  = (e) => {
        if (!state.drawing) return;
        const { x, y } = getPos(e);
        ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.strokeStyle = '#111827';
        ctx.beginPath(); ctx.moveTo(state.lastX, state.lastY); ctx.lineTo(x, y); ctx.stroke();
        state.lastX = x; state.lastY = y;
        this.state.signatures[key].drawn = true;
      };
      const end   = () => {
        state.drawing = false;
        try { this.state.signatures[key].dataUrl = canvas.toDataURL('image/png'); } catch {}
        this.saveDraft();
      };

      canvas.addEventListener('mousedown', start);
      canvas.addEventListener('mousemove', move);
      canvas.addEventListener('mouseup', end);
      canvas.addEventListener('mouseleave', end);
      canvas.addEventListener('touchstart', start, { passive: false });
      canvas.addEventListener('touchmove', move, { passive: false });
      canvas.addEventListener('touchend', end);
    },

    clearSignature(who) {
      const id = who === 'emt' ? 'emtSignatureCanvas' : 'staffSignatureCanvas';
      const canvas = document.getElementById(id);
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, rect.width, rect.height);
      this.state.signatures[who] = { drawn: false, dataUrl: null };
      this.saveDraft();
    },

    // Draft
    saveDraft() {
      const data = this.serializeForm({ includeBlobs: false });
      data.currentStep = this.state.currentStep;
      data.language = this.state.language;
      try { localStorage.setItem(this.state.draftKey, JSON.stringify(data)); } catch {}
    },

    restoreFromDraft() {
      const raw = localStorage.getItem(this.state.draftKey);
      if (!raw) return;
      try {
        const data = JSON.parse(raw);
        const form = this.els.form;
        Object.keys(data.values || {}).forEach(name => {
          const value = data.values[name];
          const inputs = form.querySelectorAll(`[name="${name}"]`);
          if (!inputs.length) return;
          const first = inputs[0];
          if (first.type === 'radio') inputs.forEach(inp => { inp.checked = (inp.value === value); });
          else if (first.type === 'checkbox') inputs.forEach(inp => { inp.checked = Array.isArray(value) && value.includes(inp.value); });
          else first.value = value;
        });

        ['symptoms', 'history', 'care'].forEach(key => {
          if (Array.isArray(data[key])) {
            this.state.multiselect[key] = new Set(data[key]);
            this.refreshSelectedItems(key, this.options[key]);
            data[key].forEach(val => {
              const cb = document.getElementById(`${key}_${val}`);
              if (cb) cb.checked = true;
            });
          }
        });

        this.state.photos = []; // only metadata saved
        this.state.signatures.emt.drawn = !!(data.signatures && data.signatures.emt);
        this.state.signatures.staff.drawn = !!(data.signatures && data.signatures.staff);

        if (data.currentStep && Number(data.currentStep) >= 1 && Number(data.currentStep) <= this.state.totalSteps) {
          this.state.currentStep = Number(data.currentStep);
        }
        if (data.language) this.setLanguage(data.language, { persist: false });

      } catch {}
    },

    // Serialize & Submit
    serializeForm({ includeBlobs = false } = {}) {
      const fd = new FormData(this.els.form);
      const values = {};
      for (const [k, v] of fd.entries()) {
        if (k.endsWith('[]')) {
          const key = k.slice(0, -2);
          if (!Array.isArray(values[key])) values[key] = [];
          values[key].push(v);
        } else if (values[k] !== undefined) {
          if (!Array.isArray(values[k])) values[k] = [values[k]];
          values[k].push(v);
        } else {
          values[k] = v;
        }
      }

      const symptoms = Array.from(this.state.multiselect.symptoms);
      const history = Array.from(this.state.multiselect.history);
      const care = Array.from(this.state.multiselect.care);

      const photos = includeBlobs
        ? this.state.photos.map(p => ({ name: p.file?.name || 'photo', type: p.file?.type, blob: p.file }))
        : this.state.photos.map(p => ({ name: p.file?.name || 'photo', type: p.file?.type, size: p.file?.size }));

      const signatures = {
        emt: this.state.signatures.emt.dataUrl || null,
        staff: this.state.signatures.staff.dataUrl || null
      };

      return { values, symptoms, history, care, photos, signatures };
    },

    async submitForm() {
      for (let i = 1; i <= this.state.totalSteps; i++) {
        if (!this.validateStep(i)) {
          this.state.currentStep = i;
          this.updateStepUI();
          return;
        }
      }

      this.toggleSpinner(true);
      this.disableNav(true);

      try {
        const payload = this.serializeForm({ includeBlobs: false });
        // await fetch('/api/eems', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
        await new Promise(res => setTimeout(res, 800));
        console.log('Submitted payload:', payload);
        this.showAlert('success', 'Form submitted successfully!', 3000);

        localStorage.removeItem(this.state.draftKey);
        this.els.form.reset();
        this.state.photos.forEach(p => URL.revokeObjectURL(p.url));
        this.state.photos = [];
        this.renderPhotos();
        ['symptoms', 'history', 'care'].forEach(key => {
          this.state.multiselect[key].clear();
          this.refreshSelectedItems(key, this.options[key]);
          this.els[key]?.dropdown?.querySelectorAll('input[type="checkbox"]').forEach(cb => (cb.checked = false));
        });
        this.clearSignature('emt');
        this.clearSignature('staff');

        this.state.currentStep = 1;
        this.updateStepUI();

      } catch (e) {
        console.error(e);
        this.showAlert('error', 'Submission failed. Please try again.');
      } finally {
        this.disableNav(false);
        this.toggleSpinner(false);
      }
    },

    toggleSpinner(on) {
      const sp = this.els.spinner;
      if (!sp) return;
      if (on) { document.body.classList.add('loading'); sp.classList.add('active'); }
      else { document.body.classList.remove('loading'); sp.classList.remove('active'); }
    },

    disableNav(disabled) {
      [this.els.prevBtn, this.els.nextBtn, this.els.submitBtn].forEach(b => { if (b) b.disabled = disabled; });
    },

    // Preview & Print
    buildPreview() {
      const container = document.getElementById('previewContainer');
      if (!container) return;

      const data = this.serializeForm();
      const v = data.values || {};
      const dict = this.i18n[this.state.language] || this.i18n.en;

      const map = (x, m) => (m && x in m ? m[x] : (x || ''));
      const yesNo = (x) => x === 'yes' ? 'Yes' : x === 'no' ? 'No' : (x || '');
      const list = (x) => Array.isArray(x) ? x.join(', ') : (x || '');

      const genderMap = { M: 'Male', F: 'Female', O: 'Other' };
      const locMap = { A: 'Alert', V: 'Verbal', P: 'Pain', U: 'Unresponsive' };
      const triageMap = {
        red_resuscitation: 'Red (Resuscitation)',
        red_urgent: 'Red (Very Urgent)',
        yellow: 'Yellow (Urgent)',
        green: 'Green (Non-Urgent)'
      };
      const ageText = () => {
        const parts = [];
        if (v.age_years) parts.push(`${v.age_years}y`);
        if (v.age_months) parts.push(`${v.age_months}m`);
        if (v.age_days) parts.push(`${v.age_days}d`);
        return parts.join(' ') || '';
      };

      const sec = (title, rowsHtml) => `
        <div class="section">
          <h3 style="margin:12px 0 8px;">${title}</h3>
          <table class="vitals-table"><tbody>${rowsHtml}</tbody></table>
        </div>
      `;
      const row = (k, val) => !val ? '' : `<tr><th style="width:32%; font-weight:600;">${k}</th><td>${val}</td></tr>`;

      let html = '';

      html += sec(dict.case_details || 'Case Details', [
        row(dict.patient_name || 'Patient Name', v.patient_name),
        row(dict.gender || 'Gender', map(v.gender, genderMap)),
        row((dict.age_group || 'Age Group') + ' / ' + (dict.age || 'Age'), [v.age_group, ageText()].filter(Boolean).join(' • ')),
        row(dict.loc || 'Level of Consciousness (AVPU)', map(v.loc, locMap)),
        row(dict.breathing || 'Breathing Pattern', v.breathing || ''),
        row(dict.chief_complaint || 'Chief Complaint', (v.chief_complaint || '').replace(/\n/g, '<br>')),
        row(dict.triage || 'Triage Category', map(v.triage, triageMap)),
        row(dict.critical || 'Critical Patient', yesNo(v.critical))
      ].join(''));

      html += sec(dict.patient_address || 'Patient Address', [
        row(dict.ration_card || 'Ration Card Type', v.ration || ''),
        row(dict.social_status || 'Social Status', v.social_status || ''),
        row(dict.id_proof || 'ID Proof Number', v.id_proof || ''),
        row(dict.contact || 'Contact Number', v.contact || ''),
        row(dict.address || 'Address', (v.address || '').replace(/\n/g, '<br>'))
      ].join(''));

      html += sec(dict.signs_symptoms || 'Signs & Symptoms', [
        row(dict.select_symptoms || 'Symptoms', list(data.symptoms) || '—')
      ].join(''));

      html += `
        <div class="section">
          <h3 style="margin:12px 0 8px;">${dict.vitals || 'Vital Signs'}</h3>
          <table class="vitals-table">
            <thead>
              <tr><th>Vital Sign</th><th>At Scene</th><th>Enroute</th><th>At Hospital</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>Blood Pressure</strong></td><td>${v.bp_scene || ''}</td><td>${v.bp_enroute || ''}</td><td>${v.bp_hospital || ''}</td></tr>
              <tr><td><strong>Pulse Rate</strong></td><td>${v.pulse_scene || ''}</td><td>${v.pulse_enroute || ''}</td><td>${v.pulse_hospital || ''}</td></tr>
              <tr><td><strong>Respiratory Rate</strong></td><td>${v.rr_scene || ''}</td><td>${v.rr_enroute || ''}</td><td>${v.rr_hospital || ''}</td></tr>
              <tr><td><strong>SpO₂ (%)</strong></td><td>${v.spo2_scene || ''}</td><td>${v.spo2_enroute || ''}</td><td>${v.spo2_hospital || ''}</td></tr>
              <tr><td><strong>Temperature (°F)</strong></td><td>${v.temp_scene || ''}</td><td>${v.temp_enroute || ''}</td><td>${v.temp_hospital || ''}</td></tr>
              <tr><td><strong>Blood Sugar (mg/dL)</strong></td><td>${v.sugar_scene || ''}</td><td>${v.sugar_enroute || ''}</td><td>${v.sugar_hospital || ''}</td></tr>
            </tbody>
          </table>
        </div>
      `;

      html += sec(dict.care_history || 'Pre-Hospital Care & History', [
        row(dict.past_history || 'Past Medical History', list(data.history) || '—'),
        row(dict.medications || 'Current Medications', (v.medications || '').replace(/\n/g, '<br>')),
        row(dict.allergies || 'Allergies', v.allergies || ''),
        row(dict.interventions || 'Interventions Performed', list(data.care) || '—'),
        row(dict.medications_given || 'Medications Administered', (v.medications_given || '').replace(/\n/g, '<br>')),
        row(dict.transport_events || 'Events During Transport', v.transport_event || '')
      ].join(''));

      html += sec(dict.admission || 'Admission Details', [
        row(dict.hospital_name || 'Receiving Hospital', v.hospital_name || ''),
        row(dict.handover_time || 'Handover Time', v.handover_time || ''),
        row(dict.receiving_staff || 'Receiving Staff Name', v.receiving_staff || ''),
        row(dict.staff_designation || 'Staff Designation', v.staff_designation || ''),
        row(dict.handover_notes || 'Handover Notes', (v.handover_notes || '').replace(/\n/g, '<br>')),
        row(dict.emt_name || 'EMT Name', v.emt_name || ''),
        row(dict.pilot_name || 'Pilot/Driver Name', v.pilot_name || ''),
        row(dict.vehicle_number || 'Ambulance Number', v.vehicle_number || '')
      ].join(''));

      // ERCP (simple)
      html += sec(dict.ercp_advice || 'ERCP Advice', [
        row(dict.ercp_consultant_name || 'Name', v.ercp_consultant_name || ''),
        row(dict.ercp_advice_text || 'Advice', (v.ercp_advice_text || '').replace(/\n/g, '<br>'))
      ].join(''));

      if (this.state.photos?.length) {
        const thumbs = this.state.photos.map((p, i) =>
          `<img src="${p.url}" alt="photo-${i+1}" style="width:110px;height:90px;object-fit:cover;border:1px solid #e5e7eb;border-radius:8px;margin:4px;">`
        ).join('');
        html += `
          <div class="section">
            <h3 style="margin:12px 0 8px;">Photo Documentation</h3>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">${thumbs}</div>
          </div>
        `;
      }

      html += `
        <div class="section">
          <h3 style="margin:12px 0 8px;">Signatures</h3>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:12px;">
            <div style="text-align:center;">
              <div style="border:1px solid #e5e7eb; border-radius:8px; height:130px; display:flex; align-items:center; justify-content:center; background:#fff;">
                ${this.state.signatures.emt.dataUrl ? `<img src="${this.state.signatures.emt.dataUrl}" alt="EMT Signature" style="max-width:100%; max-height:120px;">` : '<span style="color:#6b7280;">EMT: Not signed</span>'}
              </div>
              <div style="margin-top:6px; font-weight:600;">EMT</div>
            </div>
            <div style="text-align:center;">
              <div style="border:1px solid #e5e7eb; border-radius:8px; height:130px; display:flex; align-items:center; justify-content:center; background:#fff;">
                ${this.state.signatures.staff.dataUrl ? `<img src="${this.state.signatures.staff.dataUrl}" alt="Receiving Staff Signature" style="max-width:100%; max-height:120px;">` : '<span style="color:#6b7280;">Receiving Staff: Not signed</span>'}
              </div>
              <div style="margin-top:6px; font-weight:600;">Receiving Staff</div>
            </div>
          </div>
        </div>
      `;

      container.innerHTML = html;
    },

    printForm() {
      const stepEl = this.els.steps[this.state.currentStep - 1];
      if (!stepEl || stepEl.id !== 'previewStep') {
        this.state.currentStep = this.state.totalSteps;
        this.updateStepUI();
      }
      this.buildPreview();
      setTimeout(() => window.print(), 50);
    },

    // Utils
    debounce(fn, wait = 250) {
      const self = this;
      let t;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(self, args), wait);
      };
    }
  };

  window.app = app;
  document.addEventListener('DOMContentLoaded', () => app.init());
})();
