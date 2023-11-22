// 1. Join individial data files into big single files
require('./generate-join-records')

// 2. Generate legacy data files
require('./generate-legacy-data')

// 3. Update box presets
require('./generate-boxpresets')

// 4. Regenerate national dex
require('./generate-national-dex')
