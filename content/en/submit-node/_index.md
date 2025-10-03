---
title: Submit a Node
description: Share your Meshtastic node details to help us map coverage.
menu: { main: { weight: 30 } }
---

{{% blocks/lead %}}
Help us grow the mesh! Share your node’s basics below.
{{% /blocks/lead %}}

<div class="mb-5" style="max-width:900px; margin:2rem auto 0 auto;">
  <p class="alert alert-info">
    <strong>Please note:</strong> Filling out this form does not guarantee your node will be featured.  
    We only feature <em>permanent installs</em> that can be seen on the mesh and verified.  
    If you would like to submit build instructions or share more detailed info, please email  
    <a href="mailto:contact@tricitiesmesh.net">contact@tricitiesmesh.net</a>.
  </p>
</div>

<div style="max-width:900px; margin:0 auto;">
<form name="submit-node" method="POST" enctype="multipart/form-data"
      action="/api/submit-node"
      class="needs-validation" novalidate>

  <!-- Honeypot -->
  <div style="position:absolute; left:-5000px" aria-hidden="true">
    <label>Leave this field empty</label>
    <input type="text" name="company" tabindex="-1" autocomplete="off">
  </div>

  <!-- Contact -->
  <fieldset class="mb-4">
    <legend class="h5">Contact</legend>
    <div class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label">Your Name *</label>
        <input type="text" class="form-control" name="contact_name" required>
        <div class="invalid-feedback">Please enter your name.</div>
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label">Email *</label>
        <input type="email" class="form-control" name="contact_email" required>
        <div class="invalid-feedback">A valid email is required.</div>
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label">Callsign (optional)</label>
        <input type="text" class="form-control" name="callsign" placeholder="e.g., W4TRC">
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label">Okay to contact for follow-up?</label>
        <select class="form-select" name="ok_to_contact">
          <option value="yes">Yes</option>
          <option value="no" selected>No</option>
        </select>
      </div>
    </div>
  </fieldset>

  <!-- Node -->
  <fieldset class="mb-4">
    <legend class="h5">Node</legend>
    <div class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label">Node Nickname *</label>
        <input type="text" class="form-control" name="node_name" required placeholder="e.g., Downtown Relay">
        <div class="invalid-feedback">Please give your node a nickname.</div>
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label">Device *</label>
        <select class="form-select" name="device" required>
          <option value="" disabled selected>Choose one</option>
          <option>LilyGO T-Echo</option>
          <option>LilyGO T-Beam</option>
          <option>Heltec V3</option>
          <option>RAK Module / DIY</option>
          <option>Other</option>
        </select>
        <div class="invalid-feedback">Select a device.</div>
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label">Power</label>
        <select class="form-select" name="power">
          <option>USB</option>
          <option>Battery</option>
          <option>Solar</option>
          <option>Mixed/Other</option>
        </select>
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label">Antenna</label>
        <input type="text" class="form-control" name="antenna" placeholder="e.g., 5 dBi omni on roof">
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label">Always On?</label>
        <select class="form-select" name="always_on">
          <option>Yes</option>
          <option selected>No</option>
        </select>
      </div>
    </div>
  </fieldset>

  <!-- Location -->
  <fieldset class="mb-4">
    <legend class="h5">Location</legend>
    <div class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label">City / Area *</label>
        <input type="text" class="form-control" name="city" required placeholder="e.g., Johnson City, TN">
        <div class="invalid-feedback">City/area is required.</div>
      </div>
      <div class="col-md-3 mb-3">
        <label class="form-label">Latitude *</label>
        <input type="number" class="form-control" name="lat"
               inputmode="decimal" step="0.000001" min="-90" max="90"
               placeholder="36.313300" required>
        <div class="invalid-feedback">Latitude must be between -90 and 90.</div>
      </div>
      <div class="col-md-3 mb-3">
        <label class="form-label">Longitude *</label>
        <input type="number" class="form-control" name="lon"
               inputmode="decimal" step="0.000001" min="-180" max="180"
               placeholder="-82.353500" required>
        <div class="invalid-feedback">Longitude must be between -180 and 180.</div>
      </div>
      <div class="col-md-6 mb-3">
        <button type="button" class="btn btn-secondary" id="useLocation">Use my location</button>
        <small class="ms-2 text-muted">Fills lat/lon from your browser.</small>
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label">Elevation (ft, optional)</label>
        <input type="number" class="form-control" name="elevation_ft" min="0" step="1" placeholder="e.g., 1720">
      </div>
      <div class="col-12 mb-3">
        <label class="form-label">Location Notes (not public)</label>
        <input type="text" class="form-control" name="location_notes" placeholder="Roof, tower, access notes, etc.">
      </div>
      <div class="col-12 mb-1 form-check">
        <input class="form-check-input" type="checkbox" value="yes" id="approxPublic" name="show_as_approx">
        <label class="form-check-label" for="approxPublic">Show only an approximate public location</label>
      </div>
    </div>
  </fieldset>

  <!-- Coverage / Notes -->
  <fieldset class="mb-4">
    <legend class="h5">Coverage & Notes</legend>
    <div class="mb-3">
      <label class="form-label">Expected Coverage</label>
      <textarea class="form-control" name="coverage" rows="3"
        placeholder="e.g., Good toward downtown and I-26 corridor; hillside blocks north."></textarea>
    </div>
    <div class="mb-3">
      <label class="form-label">Photo/Diagram Upload (optional)</label>
      <input type="file" class="form-control" name="attachment" accept="image/*,.pdf">
    </div>
    <div class="mb-3">
      <label class="form-label">Photo or Diagram URL (optional)</label>
      <input type="url" class="form-control" name="photo_url" placeholder="https://…">
    </div>
  </fieldset>

  <!-- Consent -->
  <fieldset class="mb-4">
    <legend class="h5">Consent</legend>
    <div class="form-check mb-2">
      <input class="form-check-input" type="checkbox" value="yes" id="consent" name="consent" required>
      <label class="form-check-label" for="consent">
        I understand Tri-Cities Mesh may store this submission and contact me about mesh coordination.
      </label>
      <div class="invalid-feedback">Consent is required.</div>
    </div>
  </fieldset>

  <button type="submit" class="btn btn-primary">Submit Node</button>
  <p class="text-muted mt-3">
    Having trouble? Email <a href="mailto:contact@tricitiesmesh.net">contact@tricitiesmesh.net</a>.
  </p>
</form>
</div>

<script>
  // Bootstrap-style validation
  (function () {
    const form = document.querySelector('form.needs-validation');
    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  })();

  // Geolocation helper
  document.getElementById('useLocation')?.addEventListener('click', () => {
    if (!navigator.geolocation) { alert('Geolocation not supported.'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        document.querySelector('[name="lat"]').value = latitude.toFixed(6);
        document.querySelector('[name="lon"]').value = longitude.toFixed(6);
      },
      (err) => alert('Could not get your location: ' + err.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
</script>
