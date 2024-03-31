// 1. Join individial data files into big single files
require('./generate-join-records')

// 2. Update box presets
require('./generate-boxpresets')

// 3. Regenerate national dex
require('./generate-national-dex')
