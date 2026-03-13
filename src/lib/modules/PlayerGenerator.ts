import { Player, Position, PlayerAttributes } from '@/types';

export class PlayerGenerator {
  private static firstNamesByCountry: Record<string, string[]> = {
    'LT': ['Jonas', 'Mantas', 'Lukas', 'Domantas', 'Rokas', 'Marius', 'Arnas', 'Eimantas'],
    'USA': ['James', 'John', 'Michael', 'Robert', 'David', 'William', 'Richard', 'Joseph'],
    'ES': ['Pau', 'Marc', 'Juan', 'Ricky', 'Sergio', 'Rudy', 'Jorge', 'Alex'],
    // ... galima plėsti
  };

  private static lastNamesByCountry: Record<string, string[]> = {
    'LT': ['Valanciunas', 'Sabonis', 'Kalnietis', 'Kuzminskas', 'Motiejunas', 'Giedraitis'],
    'USA': ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'],
    'ES': ['Gasol', 'Rubio', 'Fernandez', 'Hernangomez', 'Rodriguez', 'Llull'],
    // ... galima plėsti
  };

  public static generatePlayer(countryId: string, minOvr = 30, maxOvr = 70): Player {
    const firstName = this.getRandomItem(this.firstNamesByCountry[countryId] || this.firstNamesByCountry['LT']);
    const lastName = this.getRandomItem(this.lastNamesByCountry[countryId] || this.lastNamesByCountry['LT']);
    const position = this.getRandomPosition();
    
    // Generuojame bazinius atributus vidurkiui
    const avgAttr = Math.floor(Math.random() * (maxOvr - minOvr + 1)) + minOvr;
    const attributes = this.generateAttributes(position, avgAttr);
    
    const ovr = this.calculateOvr(attributes);
    const pot = Math.min(99, ovr + Math.floor(Math.random() * 20));

    return {
      id: Math.random().toString(36).substring(2, 11),
      teamId: null,
      firstName,
      lastName,
      age: 16 + Math.floor(Math.random() * 20),
      birthCountryId: countryId,
      position,
      ovr,
      pot,
      loyalty: 50 + Math.floor(Math.random() * 50),
      morale: 70 + Math.floor(Math.random() * 30),
      rhythm: 50,
      attributes,
      injuryStatus: 'HEALTHY',
      fatigueSeason: 0
    };
  }

  private static generateAttributes(pos: Position, avg: number): PlayerAttributes {
    const attr: Partial<PlayerAttributes> = {};
    const skillList: (keyof PlayerAttributes)[] = [
      'closeShot', 'midRange', 'threePoint', 'freeThrow', 'ballHandling', 'passing', 'offensiveRebound',
      'perimeterDefense', 'interiorDefense', 'steal', 'block', 'defensiveRebound',
      'speed', 'strength', 'vertical', 'stamina', 'injuryProneness',
      'basketballIq', 'clutch', 'potential'
    ];

    skillList.forEach(skill => {
        // Paprasta variacija +/- 15 nuo vidurkio
        let val = avg + (Math.floor(Math.random() * 31) - 15);
        
        // Pozicijos specifika (supaprastinta)
        if (pos === 'C' && (skill === 'interiorDefense' || skill === 'defensiveRebound' || skill === 'block')) val += 10;
        if (pos === 'PG' && (skill === 'passing' || skill === 'ballHandling' || skill === 'speed')) val += 10;
        if (pos === 'SG' && skill === 'threePoint') val += 10;

        attr[skill] = Math.max(10, Math.min(99, val));
    });

    return attr as PlayerAttributes;
  }

  private static calculateOvr(attr: PlayerAttributes): number {
      // Supaprastintas vidurkis (galima daryti svertinį pagal poziciją)
      const values = Object.values(attr);
      const sum = values.reduce((a, b) => a + b, 0);
      return Math.floor(sum / values.length);
  }

  private static getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private static getRandomPosition(): Position {
    const positions: Position[] = ['PG', 'SG', 'SF', 'PF', 'C'];
    return positions[Math.floor(Math.random() * positions.length)];
  }
}
