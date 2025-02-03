
export default class Daisy {
    constructor(name, parent1 = null, parent2 = null, dna = null) {
        this.name = name;
        this.parent1 = parent1;
        this.parent2 = parent2;
        // DNA represnted as 16 bit integer. first 8 bits are genes inherited from parents, second 8 bits are dominance/recessiveness
        if (dna === null || dna < 0 || dna >= 0x10000) {
            this.dna = (Math.random() * 0x10000) >>> 0;
        } else {
            this.dna = dna
        }
        this.dnaDecoded = this.dna.toString(2).padEnd(16, '0');
        this.expressed = this.getExpressed();
    }

    breed(other, name = null) {
        if (name === null) {
            name = "Child of " + this.name + " and " + other.name;
        }
        // determine inheritance pattern. 0 = parent 1, 1 = parent 2
        const inheritance = ((Math.random() * 0x100) >>> 0).toString(2).padEnd(8, '0');

        let childDnaRaw = "";
        // pass genes to child
        for (let i = 0; i < 8; i++) {
            if (inheritance[i] === '0') {
                childDnaRaw += this.dnaDecoded[i];
            } else {
                childDnaRaw += other.dnaDecoded[i];
            }
        }

        // pass dominance/recessiveness to child
        for (let i = 0; i < 8; i++) {
            if (inheritance[i] === '0') {
                childDnaRaw += this.dnaDecoded[i + 8];
            } else {
                childDnaRaw += other.dnaDecoded[i + 8];
            }
        }

        const childDna = parseInt(childDnaRaw, 2);
        return new Daisy(name, this, other, childDna);
        
    }

    getExpressed() {
        const dnaDecoded = this.dna.toString(2).padEnd(16, '0');

        const genes1 = dnaDecoded.slice(0, 4);
        const genes2 = dnaDecoded.slice(4, 8);

        const expression1 = dnaDecoded.slice(8, 12);
        const expression2 = dnaDecoded.slice(12, 16);

        let expressed = 0;
        for (let i = 0; i < 4; i++) {
            if (expression1[i] === '1' && expression2[i] === '1') {
                expressed += Math.pow(2, i) * ((parseInt(genes1[i]) + parseInt(genes2[i])) / 2);
            } else if (expression1[i] === '1') {
                expressed += Math.pow(2, i) * parseInt(genes1[i]);
            } else if (expression2[i] === '1') {
                expressed += Math.pow(2, i) * parseInt(genes2[i]);
            } else {
                expressed += Math.pow(2, i) * ((parseInt(genes1[i]) + parseInt(genes2[i])) / 2);;
            }
        }

        return Math.ceil(expressed);
        
    }
}