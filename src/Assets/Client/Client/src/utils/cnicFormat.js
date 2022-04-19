// Helper function for cnic FormData; 
//! Check if CNIC exist then update its format

export const formatCNIC = function (CNIC) {
    if (CNIC) {
        let mask = 'xxxxx-xxxxxxx-x';
        let s = CNIC.toString();
        let outPut = '';
        for (var im = 0, is = 0; im < mask.length && is < s.length; im++) {
            outPut += mask.charAt(im) == 'x' ? s.charAt(is++) : mask.charAt(im);
        }
        outPut = /^[0-9]{5}-[0-9]{7}-[0-9]$/.test(outPut) ? outPut : 'Invalid CNIC';
        return outPut;
    } else return 'invalid CNIC'
};