import { Resolver, Query, Parent, ResolveField } from '@nestjs/graphql';
import { Customer } from '../models/customer';
import { CustomersService } from '../../../services/customers.service';
import { AuthUser, CurrentUser } from '../../../http/auth/current-user';
import { UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from '../../../http/auth/authorization.guard';
import { PurchasesService } from '../../../services/purchases.service';

@Resolver(() => Customer)
export class CustomersResolver {
  constructor(
    private customersService: CustomersService,
    private purchasesService: PurchasesService,
  ) {}

  @UseGuards(AuthorizationGuard)
  @Query(() => Customer)
  me(@CurrentUser() user: AuthUser) {
    return this.customersService.getCustomerByAuthUserId(user.sub);
  }

  @ResolveField()
  purchases(@Parent() customer: Customer) {
    return this.purchasesService.listAllFromCustomer(customer.id);
  }
}
